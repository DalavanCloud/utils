import admZip from 'adm-zip'
import crypto from 'crypto'
import fse from 'fs-extra'
import os from 'os'
import packDir from './packDir'
import path from 'path'

describe('#packDir()', () => {
  let outputDirPath
  let inputDirPath

  beforeEach(async () => {
    inputDirPath = path.join(os.tmpdir(), crypto.randomBytes(6).toString('hex'))
    outputDirPath = path.join(os.tmpdir(), crypto.randomBytes(6).toString('hex'))
    await fse.ensureDir(inputDirPath)
    await fse.ensureDir(outputDirPath)
    await fse.writeJson(path.join(inputDirPath, 'foo.json'), {
      key1: 'value1',
      key2: 'value2'
    })
    // outsider file to append...
    await fse.writeJson(path.join(outputDirPath, 'bar.json'), {
      key3: 'value3',
      key4: 'value4'
    })
  })

  it('should package a directory and return the file path', async () => {
    const outputFilePath = path.join(outputDirPath, `${crypto.randomBytes(6).toString('hex')}.zip`)
    const returnedOutputFilePath = await packDir(inputDirPath, outputFilePath)
    const zipRes = await fse.readFile(outputFilePath)
    const zip = admZip(zipRes)
    const files = zip.getEntries().map((entry) => ({
      name: entry.entryName,
      content: entry.getData()
    }))
    const jsonFile = files.filter((file) => file.name === 'foo.json').pop()

    expect(files.length).toEqual(1)
    expect(JSON.parse(jsonFile.content.toString('utf8'))).toEqual({
      key1: 'value1',
      key2: 'value2'
    })
    expect(returnedOutputFilePath).toEqual(outputFilePath)
  })

  it('should package a directory, append files, and return the file path', async () => {
    const outputFilePath = path.join(outputDirPath, `${crypto.randomBytes(6).toString('hex')}.zip`)
    const fileToAppend = path.join(outputDirPath, 'bar.json')
    const returnedOutputFilePath = await packDir(inputDirPath, outputFilePath, [fileToAppend])
    const zipRes = await fse.readFile(outputFilePath)
    const zip = admZip(zipRes)
    const files = zip.getEntries().map((entry) => ({
      name: entry.entryName,
      content: entry.getData()
    }))
    const jsonFile = files.filter((file) => file.name === 'foo.json').pop()
    const appendedFile = files.filter((file) => file.name === 'bar.json').pop()

    expect(files.length).toEqual(2)
    expect(JSON.parse(jsonFile.content.toString('utf8'))).toEqual({
      key1: 'value1',
      key2: 'value2'
    })
    expect(JSON.parse(appendedFile.content.toString('utf8'))).toEqual({
      key3: 'value3',
      key4: 'value4'
    })
    expect(returnedOutputFilePath).toEqual(outputFilePath)
  })

  it('should package a directory twice and have the same sha', async () => {
    const fileToAppend = path.join(outputDirPath, 'bar.json')

    const outputFilePath1 = path.join(outputDirPath, `${crypto.randomBytes(6).toString('hex')}.zip`)
    await packDir(inputDirPath, outputFilePath1, [fileToAppend])
    const zipFile1 = await fse.readFile(outputFilePath1)
    const sha1 = crypto
      .createHash('sha256')
      .update(zipFile1)
      .digest('base64')

    const outputFilePath2 = path.join(outputDirPath, `${crypto.randomBytes(6).toString('hex')}.zip`)
    await packDir(inputDirPath, outputFilePath2, [fileToAppend])
    const zipFile2 = await fse.readFile(outputFilePath2)
    const sha2 = crypto
      .createHash('sha256')
      .update(zipFile2)
      .digest('base64')
    expect(sha1).toEqual(sha2)
  })
})
