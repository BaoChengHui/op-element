import type { BooleanAble, Promisable } from '../types'
import { isBoolean, isFunction, isPromise, isString } from './is'

export const booleanAbleExecuter = (it: BooleanAble, ...arg: any[]): boolean => {
  if (isBoolean(it)) {
    return it
  }
  if (isFunction(it)) {
    return it(...arg)
  }
  return false
}

export const promiseAbelExcuter = <T>(it: (...arg: any) => Promisable<T>, ...arg: any[]): Promise<T> => {
  return new Promise((resolve, reject) => {
    const r = it(...arg)
    if (isPromise(r)) {
      r.then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    }
    else {
      resolve(r)
    }
  })
}

const reg = /^(\d+\.)?\[(.*)\]$/ // like [startTime,endTime] or 1.[startTime,endTime]
export const getArrDestructorKeys = (prop?: string) => {
  if (isString(prop) && reg.test(prop)) {
    return prop.replace(reg, (_, $1, $2) => {
      return $2
    }).split(',')
  }
  return null
}
const objReg = /^(\d+\.)?\{(.*)\}$/ // like {startTime,endTime} or 1.{startTime,endTime}
export const getObjDestructorkeys = (prop?: string) => {
  if (isString(prop) && objReg.test(prop)) {
    return prop.replace(objReg, (_, $1, $2) => {
      return $2
    }).split(',')
  }
  return null
}
