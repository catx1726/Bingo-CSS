/* 
  TODO 
  1. 新增层级从年份开始 2020/10M/...
  2. 初始化所有接口，直接输入 2020/* 检索下面所有，然后添加到 readme
  3. 后续新增接口，判断输入的文件层级，第一个参数必须是最外层，检测单个文件夹然后添加到 readme
*/

class FileCheck {
  fs = require('fs')
  join = require('path').join

  // 一个文件数组，存放所有需要生成节点的文件路径
  localFilePathList = []

  // 当前路径
  localDirectoryPath = ''

  // 存放传入的根路径
  path = ''

  handleDirectory(path) {
    let curPath = this.join(this.path, path),
      stat = this.fs.statSync(curPath)
    if (stat.isDirectory()) {
      console.log('isDirectory:', stat)
    }
  }

  handleFile(name) {}

  input(pathList) {
    // 年份文件后紧跟 * 号，代表 2020/* 所有
    this.path = pathList[0]
    if (pathList[1] === '*') {
      let tempPathList = this.fs.readdirSync(pathList[0], (err, fd) => {
        if (err) throw err
        this.fs.close(fd)
      })
      tempPathList.forEach((item) => {
        this.handleDirectory(item)
      })
    }
  }

  /**
   *
   *
   * @param {String} file，当前检索文件
   * @param {String} curPath，当前检索的路径
   * @memberof FileCheck
   */
  repeatCheck(file, curPath) {
    console.log(`我要在下面的文件中检测 ${curPath} 是否有重复啦:\n`, file)
    // 有重复
    if (file.indexOf(curPath) !== -1) {
      console.log('┗|｀O′|┛ 该文加已经添加过了')
      return false
    }
    console.log('这个文件好像还没有添加过，我马上帮你添加\n O(∩_∩)O')
    // 无重复
    return true
  }
}

try {
  let file = new FileCheck()
  if (typeof process.argv[2] === 'undefined') {
    throw Error('你需要输入一个文件夹名')
  }
  let pathList = process.argv.slice(2)
  console.log('——————即将检索文件夹:', pathList, '\n', process.argv)
  file.input(pathList)
  // file.output()
} catch (error) {
  console.log(error)
}
