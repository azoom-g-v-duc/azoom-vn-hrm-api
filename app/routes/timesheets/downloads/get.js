import { parse, format, getYear, getMonth } from 'date-fns/fp'
import Excel from 'exceljs'
import { leaveType } from '@constants'
import { execute } from '@root/util'
import getUsers from '@routes/users/get'
import getTimesheets from '@routes/timesheets/get'
import { uploadFile } from '@helpers/google-storage'
import fs from 'fs'

const morningMaxCheckinTime = '10:00'
const endMorningTime = '12:00'
const afternoonMaxCheckinTime = '15:00'

export default async (req, res) => {
  const {
    year = getYear(new Date()),
    month = getMonth(new Date()) + 1,
  } = req.query

  const excel = await createDownloadExcel({ year, month }, req.user)
  const downloadFileName = `timesheet_${format(
    'yyyyMMdd_HHmmss',
    new Date()
  )}.xlsx`

  await excel.xlsx.writeFile(downloadFileName)
  const url = await uploadFile(downloadFileName)
  await fs.unlinkSync(downloadFileName)

  return res.send({ link: url })
}

const createDownloadExcel = async ({ year, month }, user) => {
  const excel = new Excel.Workbook()
  const sheet = excel.addWorksheet()

  //add header
  sheet.addRow(['BẢNG CHẤM CÔNG'])
  sheet.addRow([`Tháng ${month} năm ${year}`])
  sheet.addRow([`${format('MMM', new Date(year, month - 1))}~${year}`])
  sheet.addRow()

  const formatConditions = { weekendsColLabels: [] }
  let columns = [
    { header: 'STT', key: 'id', width: 5 },
    { header: 'Họ tên', key: 'name', width: 25 },
    { header: 'Chức danh', key: 'position', width: 10 },
  ]

  const days = getDaysInMonth({ year, month })

  days.forEach((day) => {
    columns.push({ header: day, key: day, width: 5 })
  })

  columns.push(
    { header: 'Ngày làm việc thực tế', key: 'workDays', width: 10 },
    { header: 'Nghỉ KL', key: 'unpaid', width: 10 },
    { header: 'Nghỉ lễ', key: 'holiday', width: 10 },
    { header: 'Nghỉ theo quy định công ty', key: 'companyRule', width: 10 },
    { header: 'Nghỉ phép', key: 'paid', width: 10 },
    { header: 'Nghỉ bù', key: 'makeup', width: 10 },
    { header: 'Ghi chú', key: 'note', width: 20 }
  )

  sheet.addRow(columns.map((column) => column.header))

  columns.forEach((column, index) => {
    const sheetColumn = sheet.getColumn(index + 1)
    sheetColumn.key = column.key
    sheetColumn.width = column.width
  })

  const dateColsOffset = 3
  const dateColumnLabel = {}

  formatConditions.titleRowOffset = sheet.rowCount

  const numberOfDays = days.length

  for (let i = 1; i <= numberOfDays; i++) {
    const cell = sheet
      .getRow(formatConditions.titleRowOffset + 1)
      .getCell(dateColsOffset + i)
    cell.value = format('eeeeee', new Date(`${year} ${month} ${i}`))
    if (['Sa', 'Su'].includes(cell.value)) {
      formatConditions.weekendsColLabels = [
        ...formatConditions.weekendsColLabels,
        cell.address.replace(/\d+/g, ''),
      ]
    }
    if (i === 1) {
      dateColumnLabel.first = cell.address.replace(/\d+/g, '')
    }

    if (i === numberOfDays) {
      dateColumnLabel.last = cell.address.replace(/\d+/g, '')
    }
  }

  formatConditions.firstDateColumnIndex = sheet.getColumn('01').number
  formatConditions.lastDateColumnIndex =
    formatConditions.firstDateColumnIndex + numberOfDays - 1

  sheet.getRow(4).getCell(formatConditions.lastDateColumnIndex + 1).value =
    'Đơn vị: Ngày'

  formatConditions.lastColumnIndex = sheet.columnCount
  formatConditions.dataRowOffset = formatConditions.titleRowOffset + 2

  const usersResponse = await execute(getUsers, {
    user,
    query: {
      page: 0,
      count: 1000,
    },
  })
  const users = usersResponse.status === 200 ? usersResponse.body : []

  const timesheetsResponse = await execute(getTimesheets, {
    query: {
      month,
      year,
    },
  })
  const timesheets =
    timesheetsResponse.status === 200 ? timesheetsResponse.body : []

  const processedTimesheets = await prepareData(users, timesheets)

  processedTimesheets.forEach((timesheet, index) => {
    timesheet.unpaid = getUnpaid(
      dateColumnLabel,
      formatConditions.dataRowOffset + index
    )
    timesheet.workDays = getWorkDays(
      dateColumnLabel,
      formatConditions.dataRowOffset + index
    )
    timesheet.holiday = getHoliday(
      dateColumnLabel,
      formatConditions.dataRowOffset + index
    )
    timesheet.paid = getPaid(
      dateColumnLabel,
      formatConditions.dataRowOffset + index
    )
    timesheet.companyRule = getCompanyRule(
      dateColumnLabel,
      formatConditions.dataRowOffset + index
    )
    timesheet.makeup = getMakeUp(
      dateColumnLabel,
      formatConditions.dataRowOffset + index
    )
    sheet.addRow(timesheet)
  })

  const lastRowIndex = sheet.rowCount
  const totalData = Object.entries({
    workDays: 0,
    unpaid: 0,
    holiday: 0,
    paid: 0,
    companyRule: 0,
    makeup: 0,
  }).reduce((totalData, [id, value]) => {
    const first = formatConditions.dataRowOffset
    const last = lastRowIndex
    const column = sheet.getColumn(id)
    const label = column ? column.letter : ''
    value = {
      formula: `SUM(${label}${first}:${label}${last})`,
    }

    return {
      ...totalData,
      [id]: value,
    }
  }, {})

  sheet.addRow({
    name: 'TỔNG CỘNG',
    ...totalData,
    note: '',
  })
  formatConditions.totalRowOffset = sheet.rowCount

  //add two blank rows
  sheet.addRow()
  sheet.addRow()

  //add footer
  sheet.addRow(['', 'KÝ HIỆU CHẤM CÔNG'])

  formatConditions.footerRowOffset = sheet.rowCount

  sheet.addRow(['', 'Đi làm 1 ngày', '+'])
  sheet.addRow(['', 'Đi làm nửa ngày', '-'])
  sheet.addRow(['', 'Nghỉ nửa ngày không lương', 'nk'])
  sheet.addRow(['', 'Nghỉ không lương', 'k'])
  sheet.addRow(['', 'Nghỉ lễ', 'l'])
  sheet.addRow(['', 'Nghỉ phép', 'p'])
  sheet.addRow(['', 'Nghỉ theo quy định công ty', 'q'])
  sheet.addRow(['', 'Công tác', 'c'])
  sheet.addRow(['', 'Nghỉ ốm đau, tai nạn', 'o'])
  sheet.addRow(['', 'Nghỉ khám thai', 't'])
  sheet.addRow(['', 'Nghỉ bù, nghỉ hiếu, hỷ', 'b'])
  sheet.addRow(['', 'Nghỉ bù, nghỉ hiếu, hỷ nửa ngày', 'nb'])

  fillFormat(sheet, formatConditions)

  return excel
}

const getUnpaid = (dateColumnLabel, index) => {
  const range = `${dateColumnLabel.first}${index}:${dateColumnLabel.last}${index}`
  return {
    formula: `IF(COUNTIF(${range},"k")<>0,COUNTIF(${range},"k"),0)+IF(COUNTIF(${range},"nk")<>0,COUNTIF(${range},"nk")/2,0)`,
  }
}

const getWorkDays = (dateColumnLabel, index) => {
  const range = `${dateColumnLabel.first}${index}:${dateColumnLabel.last}${index}`
  return {
    formula: `IF(COUNTIF(${range},"+")<>0,COUNTIF(${range},"+"),0)+IF(COUNTIF(${range},"-")<>0,COUNTIF(${range},"-")/2,0)+IF(COUNTIF(${range},"nk")<>0,COUNTIF(${range},"nk")/2,0)`,
  }
}

const getHoliday = (dateColumnLabel, index) => {
  const range = `${dateColumnLabel.first}${index}:${dateColumnLabel.last}${index}`
  return {
    formula: `IF(COUNTIF(${range},"l")<>0,COUNTIF(${range},"l"),0)`,
  }
}

const getPaid = (dateColumnLabel, index) => {
  const range = `${dateColumnLabel.first}${index}:${dateColumnLabel.last}${index}`
  return {
    formula: `IF(COUNTIF(${range},"p")<>0,COUNTIF(${range},"p"),0)+IF(COUNTIF(${range},"-")<>0,COUNTIF(${range},"-")/2,0)`,
  }
}

const getCompanyRule = (dateColumnLabel, index) => {
  const range = `${dateColumnLabel.first}${index}:${dateColumnLabel.last}${index}`
  return {
    formula: `IF(COUNTIF(${range},"q")<>0,COUNTIF(${range},"q"),0)`,
  }
}

const getMakeUp = (dateColumnLabel, index) => {
  const range = `${dateColumnLabel.first}${index}:${dateColumnLabel.last}${index}`
  return {
    formula: `IF(COUNTIF(${range},"b")<>0,COUNTIF(${range},"b"),0)+IF(COUNTIF(${range},"nb")<>0,COUNTIF(${range},"nb")/2,0)`,
  }
}

const prepareData = async (users, timesheets) => {
  const groupedTimesheets = users.reduce((groupedTimesheets, user) => {
    const userTimesheets = timesheets.filter((timesheet) => {
      return timesheet.userId === user.id
    })

    return [
      ...groupedTimesheets,
      {
        user,
        userTimesheets,
      },
    ]
  }, [])

  return groupedTimesheets.reduce((processedData, groupedTimesheet) => {
    const user = groupedTimesheet.user
    const data = groupedTimesheet.userTimesheets.reduce(
      (data, userTimesheet) => {
        const leaveTypeSymbol = getLeaveTypeSymbol(userTimesheet)
        data[
          `${format('dd', new Date(userTimesheet.checkedDate))}`
        ] = leaveTypeSymbol

        return {
          ...data,
        }
      },
      {}
    )
    return [
      ...processedData,
      {
        ...data,
        name: user.fullName,
        permission: user.permission,
        id: user.id,
        position: user.position,
        note: '',
      },
    ]
  }, [])
}

const getDaysInMonth = ({ month, year }) => {
  let day = parse(new Date(), 'yyyy/MM/dd', `${year}/${month}/01`)
  let days = []
  while (day.getMonth() === month - 1) {
    days.push(format('dd', new Date(day)))
    day.setDate(day.getDate() + 1)
  }
  return days
}

const getLeaveTypeSymbol = (timesheet) => {
  const currentDate = new Date()

  const startTime = timesheet.startTime
    ? parse(currentDate, 'HH:mm', timesheet.startTime)
    : undefined
  const endTime = timesheet.endTime
    ? parse(currentDate, 'HH:mm', timesheet.endTime)
    : undefined

  if (timesheet.leaveTypeId) {
    if (
      timesheet.leaveTypeId === leaveType.paidLeave ||
      timesheet.leaveTypeId === leaveType.makeUp
    ) {
      return timesheet.leaveTypeId === leaveType.paidLeave ? 'p' : 'b'
    }

    if (
      timesheet.leaveTypeId === leaveType.paidLeaveMorning ||
      timesheet.leaveTypeId === leaveType.makeUpLeaveMorning
    ) {
      if (
        startTime.getTime() >
        parse(currentDate, 'HH:mm', afternoonMaxCheckinTime).getTime()
      ) {
        return ''
      }
      return timesheet.leaveTypeId === leaveType.paidLeaveMorning ? '-' : 'nb'
    }

    if (
      timesheet.leaveTypeId === leaveType.paidLeaveAfternoon ||
      timesheet.leaveTypeId === leaveType.makeUpLeaveAfternoon
    ) {
      if (
        startTime.getTime() >
          parse(currentDate, 'HH:mm', morningMaxCheckinTime).getTime() ||
        endTime.getTime() < parse(currentDate, 'HH:mm', endMorningTime).getTime()
      ) {
        return ''
      }
      return timesheet.leaveTypeId === leaveType.paidLeaveAfternoon ? '-' : 'nb'
    }

    if (timesheet.leaveTypeId === leaveType.unpaidLeaveMorning) {
      if (
        startTime.getTime() >
        parse(currentDate, 'HH:mm', afternoonMaxCheckinTime).getTime()
      ) {
        return ''
      }
      return 'nk'
    }

    if (timesheet.leaveTypeId === leaveType.unpaidLeaveAfternoon) {
      if (
        startTime.getTime() >
          parse(currentDate, 'HH:mm', morningMaxCheckinTime).getTime() ||
        endTime.getTime() < parse(currentDate, 'HH:mm', endMorningTime).getTime()
      ) {
        return ''
      }
      return 'nk'
    }

    if (timesheet.leaveTypeId === leaveType.unpaidLeave) {
      return 'k'
    }
    //TODO
  }

  if (startTime && endTime) {
    let workDays = 0
    if (
      startTime.getTime() <=
      parse(currentDate, 'HH:mm', morningMaxCheckinTime).getTime()
    ) {
      workDays += 1
    } else {
      workDays += 0.5
    }

    if (
      endTime.getTime() <
      parse(currentDate, 'HH:mm', afternoonMaxCheckinTime).getTime()
    ) {
      workDays -= 0.5
    }
    if (workDays == 1) return '+'
    return workDays == 0 ? '' : '-'
  }
  return ''
}

function fillFormat(sheet, conditions) {
  const titleBgColor = '01fe9632'
  const weekendsBgColor = '0149a400'
  const totalRowColor = '015E0067'

  //format HEADER
  sheet.mergeCells(1, 1, 1, conditions.lastColumnIndex)
  sheet.mergeCells(2, 1, 2, conditions.lastColumnIndex)
  sheet.mergeCells(3, 1, 3, conditions.lastColumnIndex)

  sheet.getCell('A1').font = { size: 18, bold: true }
  sheet.getCell('A2').font = { size: 12, bold: true }
  sheet.getCell('A3').font = { size: 12, bold: true }

  sheet.mergeCells('A5:A6')
  sheet.mergeCells('B5:B6')
  sheet.mergeCells('C5:C6')

  for (
    let i = 1;
    i <= conditions.lastColumnIndex - conditions.lastDateColumnIndex;
    i++
  ) {
    sheet.mergeCells(
      conditions.titleRowOffset,
      conditions.lastDateColumnIndex + i,
      conditions.titleRowOffset + 1,
      conditions.lastDateColumnIndex + i
    )
  }

  sheet.getRow(conditions.titleRowOffset).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: titleBgColor },
  }

  sheet.getRow(conditions.titleRowOffset).height = 20
  sheet.getRow(conditions.titleRowOffset + 1).height = 60
  sheet.getRow(conditions.titleRowOffset + 1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: titleBgColor },
  }

  sheet.getRow(conditions.titleRowOffset).alignment = {
    vertical: 'middle',
    horizontal: 'center',
  }
  sheet.getRow(conditions.titleRowOffset + 1).alignment = {
    vertical: 'middle',
    horizontal: 'center',
  }

  sheet.eachRow((row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
      cell.alignment = {
        ...cell.alignment,
        vertical: 'middle',
        horizontal: 'center',
      }
    })
  })

  conditions.weekendsColLabels.forEach((label) => {
    sheet
      .getColumn(label)
      .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (
          rowNumber >= conditions.titleRowOffset &&
          rowNumber < conditions.totalRowOffset
        ) {
          cell.fill = {
            ...cell.fill,
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: weekendsBgColor },
          }
        }
      })
  })

  sheet.getRow(conditions.totalRowOffset).fill = {
    ...sheet.getRow(conditions.totalRowOffset).fill,
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: totalRowColor },
  }

  sheet.getRow(conditions.totalRowOffset).font = {
    ...sheet.getRow(conditions.totalRowOffset).font,
    color: { argb: '01FFFFFF' },
  }

  const verticalTitles = [
    'position',
    'workDays',
    'paid',
    'unpaid',
    'holiday',
    'makeup',
    'companyRule',
    'note',
  ]
  verticalTitles.map((id) => {
    const column = sheet.getColumn(id)
    const columnLabel = column.letter
    sheet.getRow(conditions.titleRowOffset).getCell(columnLabel).alignment = {
      textRotation: 90,
      wrapText: true,
      vertical: 'middle',
      horizontal: 'center',
    }
  })

  sheet.getRow(conditions.titleRowOffset).eachCell((cell, columnNumber) => {
    if (
      columnNumber < conditions.firstDateColumnIndex ||
      columnNumber > conditions.lastDateColumnIndex
    ) {
      cell.font = { ...cell.font, size: 10, bold: true }
    }
  })

  sheet.getRow(conditions.footerRowOffset).getCell(2).font = {
    size: 12,
    bold: true,
    underline: true,
  }
}
