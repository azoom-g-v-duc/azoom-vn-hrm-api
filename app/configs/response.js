import express from 'express'

export const myExpress = Object.create(express().response, {
  data: {
    value: function(data) {
      return this.status(200).json({status: true, data: data})
    },
  },
  message: {
    value: function(msg) {
      return this.status(200).json({status: true, message: msg})
    },
  },
})