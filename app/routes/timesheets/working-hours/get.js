import { format, parse, getYear, getMonth, sub } from 'date-fns/fp'
import { execute } from '@root/util'
import Excel from 'exceljs'
import getUser from '@routes/users/get'
import getTimesheet from '@routes/timesheets/get'

const freeTime = { hours: 1 }

export default async (req, res) => {
  const {
    month = getMonth(new Date()) + 1,
    year = getYear(new Date()),
    timeZone = '+00:00'
  } = req.query
  const fileName = `/files/working_hour_${format('yyyy_MM_dd_mm_ss', new Date())}.xlsx`
  const excel = await createWorkingHourReportFile(
    { year, month, timeZone },
    req.user
  )

  await excel.xlsx.writeFile(fileName)
  res.send({ message: 'Successfully' + fileName })
}

const createWorkingHourReportFile = async ({ year, month, timeZone }, user) => {
  const excel = new Excel.Workbook()
  excel.addWorksheet('Detail')
  excel.addWorksheet('Summary')

  const users = getUsers(user)
  const timesheets = getTimesheets({ month, year, timeZone })

  buildDetailSheet({
    users,
    timesheets,
    month,
    year,
    workbook: excel,
    timeZone
  })

  return excel
}

const buildDetailSheet = ({
  users,
  timesheets,
  year,
  month,
  workbook,
  timeZone
}) => {
  const detail = workbook.getWorksheet('Detail')
  const nameRow = detail.addRow()

  const columns = users.reduce(
    (columns, user) => {
      return [...columns, user.id + '.workHours', user.id + '.actualWorkHours']
    },
    ['date']
  )

  columns.forEach((column, index) => {
    const sheetColumn = detail.getColumn(index + 1)
    sheetColumn.key = column
  })

  users.forEach((user, index) => {
    nameRow.getCell(index * 2 + 2).value = user.fullName
  })

  for (let i = 0, size = users.length; i < size; i++) {
    detail.mergeCells(0, i * 2 + 2, 0, i * 2 + 3)
  }
  const dataRowOffset = detail.rowCount + 1

  const rows = buildDetailRows(timesheets, { year, month, timeZone })
  detail.addRows(rows)
  console.log(rows)

  const totalRow = buildTotalRow(
    { startRow: dataRowOffset, endRow: detail.rowCount },
    detail
  )
  detail.addRow(totalRow)
}

const buildTotalRow = (range, sheet) => {
  const row = sheet.columns.reduce(
    (row, column) => {
      if (column.key === 'date') return row
      const formula = `SUM(${column.letter}${range.startRow}:${column.letter}${range.endRow})`
      return {
        ...row,
        [column.key]: {
          formula
        }
      }
    },
    { date: 'TOTAL' }
  )
  return row
}

const buildDetailRows = (timesheets, { year, month, timeZone }) => {
  const daysInMonth = getDaysInMonth({ month, year }).reduce((days, day) => {
    return [...days, format('yyyy-MM-dd', day)]
  }, [])

  const groupedTimesheets = groupTimesheets(timesheets, timeZone)
  const rows = daysInMonth.reduce((rows, day) => {
    const groupedTimesheet = groupedTimesheets[day]
    return [
      ...rows,
      {
        date: day,
        ...groupedTimesheet
      }
    ]
  }, [])
  return rows
}

const groupTimesheets = (timesheets, timeZone) => {
  const defaultDate = new Date()

  return timesheets.reduce((groupedTimesheets, timesheet) => {
    const groupedTimesheet = groupedTimesheets[timesheet.checkedDate]
      ? groupedTimesheets[timesheet.checkedDate]
      : {}
      console.log(`${timesheet.startTime} GMT ${timeZone}`)
    const startTime = parse(
      defaultDate,
      'HH:mm \'GMT\' XXX',
      `${timesheet.startTime} GMT ${timeZone}`
    )
    const endTime = parse(
      defaultDate,
      'HH:mm \'GMT\' XXX',
      `${timesheet.endTime} GMT ${timeZone}`
    )
    console.log(startTime, endTime)
    groupedTimesheet[`${timesheet.userId}.workHours`] = sub(
      { hours: startTime.getHours(), minutes: startTime.getMinutes() },
      endTime
    )

    groupedTimesheet[`${timesheet.userId}.actualWorkHours`] = sub(
      freeTime,
      parse(
        defaultDate,
        'HH:mm',
        groupedTimesheet[`${timesheet.userId}.workHours`]
      )
    )

    groupedTimesheet[`${timesheet.userId}.in`] = timesheet.startTime

    groupedTimesheet[`${timesheet.userId}.out`] = timesheet.endTime

    groupedTimesheet.date = timesheet.checkedDate

    return {
      ...groupedTimesheets,
      [timesheet.checkedDate]: groupedTimesheet
    }
  }, {})
}

const getDaysInMonth = ({ month, year }) => {
  let day = parse(new Date(), 'yyyy/MM/dd', `${year}/${month}/01`)
  let days = []
  while (day.getMonth() === month - 1) {
    days.push(new Date(day))
    day.setDate(day.getDate() + 1)
  }
  return days
}

const getUsers = (loggedUser) => {
  //   const userResponse = execute(getUser, {
  //     query: { page: 0, count: 1000 },
  //     user: loggedUser
  //   })
  //   return userResponse.status !== 200 ? [] : userResponse.body
  return [
    { id: '22', fullName: 'Nguyễn Hồng Cảnh', permission: 1, position: 'TL' },
    { id: '23', fullName: 'Nguyễn Tài Tuấn', permission: 2, position: 'LTV' },
    { id: '24', fullName: 'Nguyễn Thị Thu Hà', permission: 6, position: 'HR' },
    { id: '25', fullName: 'Trần Quang Hoà', permission: 10, position: 'LTV' },
    { id: '26', fullName: 'Nguyễn Bá Thắng', permission: 10, position: 'HVCG' },
    { id: '27', fullName: 'Lê Đức Minh', permission: 10, position: 'HVCG' },
    { id: '28', fullName: 'Giáp Việt Đức', permission: 10, position: 'LTV' },
    { id: '29', fullName: 'Phan Kim Tôn', permission: 10, position: 'HVCG' }
  ]
}

const getTimesheets = ({ month, year }) => {
  //   const timesheetResponse = execute(getTimesheet, { params: { month, year } })
  //   return timesheetResponse.status !== 200 ? [] : timesheetResponse.body
  return [
    {
      userId: '22',
      checkedDate: '2020-03-02',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-03',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-04',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-05',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-06',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-09',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-10',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-11',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-12',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-13',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-16',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-17',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-18',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-19',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-20',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-23',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-24',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-25',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-26',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-27',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-30',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '22',
      checkedDate: '2020-03-31',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-02',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-03',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-04',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-05',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-06',
      startTime: '07:59',
      endTime: '17:01',
      leaveTypeId: 6
    },
    {
      userId: '23',
      checkedDate: '2020-03-09',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-10',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-11',
      startTime: '13:00',
      endTime: '17:00',
      leaveTypeId: 4
    },
    {
      userId: '23',
      checkedDate: '2020-03-12',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-13',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-16',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-17',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-18',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-19',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-20',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-23',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-24',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-25',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-26',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-27',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-30',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '23',
      checkedDate: '2020-03-31',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-02',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-03',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-04',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-05',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-06',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-09',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-10',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-11',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-12',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-13',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-16',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-17',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-18',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-19',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-20',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-23',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-24',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-25',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-26',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-27',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-30',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '24',
      checkedDate: '2020-03-31',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-02',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-03',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-04',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-05',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-06',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-09',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-10',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-11',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-12',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-13',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-16',
      startTime: '07:59',
      endTime: '17:01',
      leaveTypeId: 6
    },
    {
      userId: '25',
      checkedDate: '2020-03-17',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-18',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-19',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-20',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-23',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-24',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-25',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-26',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-27',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-30',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '25',
      checkedDate: '2020-03-31',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '26',
      checkedDate: '2020-03-02',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '26',
      checkedDate: '2020-03-03',
      startTime: '07:59',
      endTime: '17:01',
      leaveTypeId: 6
    },
    {
      userId: '26',
      checkedDate: '2020-03-04',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '27',
      checkedDate: '2020-03-02',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-05',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-06',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-09',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-10',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-11',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-12',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-13',
      startTime: '07:59',
      endTime: '17:01',
      leaveTypeId: 6
    },
    {
      userId: '28',
      checkedDate: '2020-03-16',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-17',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-18',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-19',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-20',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-23',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-24',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-25',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-26',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-27',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-30',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '28',
      checkedDate: '2020-03-31',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-12',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-13',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-16',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-17',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-18',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-19',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-20',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-23',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-24',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-25',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-26',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-27',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-30',
      startTime: '07:59',
      endTime: '17:01'
    },
    {
      userId: '29',
      checkedDate: '2020-03-31',
      startTime: '07:59',
      endTime: '17:01'
    }
  ]
}
