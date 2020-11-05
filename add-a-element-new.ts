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

  // 存放传入的根路径
  path = ''

  // 不需要添加的文件夹
  ignorePathList = ['css', 'imgs']

  joinPath(path, name) {
    return path + '/' + name
  }

  handleDirectory(path) {
    // console.log('cur path:', path)
    let pathList = this.fs.readdirSync(path, (err, fd) => {
      if (err) throw err
      this.fs.close(fd)
    })
    // console.log('cur pathList:', pathList)
    pathList.forEach((item) => {
      let curPath = this.joinPath(path, item),
        stat = this.fs.statSync(curPath)
      if (stat.isDirectory()) {
        this.handleDirectory(curPath)
        return
      }
      // 只保留 .html
      if (!curPath.includes('.html')) return
      this.localFilePathList.push(curPath)
    })
  }

  input(pathList) {
    // 年份文件后紧跟 * 号，代表 2020/* 所有
    if (pathList[1] === '*') {
      this.path = pathList[0]
      this.handleDirectory(pathList[0])
      console.log(`${this.path} checkEnd FileList:`, this.localFilePathList)
      this.output()
      return
    }
    // 年份之后紧跟的是指定的文件夹，代表 2020/10M 只需要执行 10M 下的文件或文件夹
    let path = pathList.join('/')
    this.handleDirectory(path)
    console.log(`${this.path} checkEnd FileList:`, this.localFilePathList)
    this.output()
  }

  output() {
    try {
      let index = this.fs.readFileSync('index.html', 'utf8')

      console.log('output:', this.localFilePathList)
      this.localFilePathList.forEach((item) => {
        this.fs.stat(this.path + '/' + item, (err, stats) => {
          if (err) console.log(err)
          // OK 只保存当天的文件，当天修改的话还是有重复
          // OK 去 index 文件搜索，如果有就不加
          let checkRepeat = this.repeatCheck(index, item)
          // console.log(checkRepeat)
          if (!checkRepeat) {
            console.log('因为这个文件已经添加过了，再见，我下线了\n')
            return
          }
          // TODO 让其再看文件源码的时候换行，方便维护，而不是只再HTML渲染的时候换行
          // TODO 可将项目地址提取成环境变量
          let htmlInner = `<a href="./${item}" target="_blank">${item}</a><br/>`
          // DES markdown超链接的方式 [文件名](地址)
          let mdInner = ` * [${item}](https://www.adba.club/CSS-Inspired-Factory/${item}) <br/>`

          this.fs.appendFileSync('index.html', htmlInner, 'utf8', (fd) => {
            this.fs.close(fd)
          })

          this.fs.appendFileSync('README.md', mdInner, 'utf8', (fd) => {
            this.fs.close(fd)
          })

          console.log('——————添加完毕，我下线了')
        })
      })
    } catch (error) {
      console.log(error)
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
  console.log('即将检索文件夹:', pathList, '\n', process.argv)
  file.input(pathList)
  // file.output()
} catch (error) {
  console.log(error)
}
