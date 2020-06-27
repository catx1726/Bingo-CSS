class FileCheck {
    fs = require('fs')

    // 一个文件数组，存放所有需要生成节点的文件路径
    outPaths = []

    // 存放传入的根路径
    path = ''

    // 传入需要检索文件是否新增的路径
    input(path) {
        this.path = path
        this.outPaths = this.fs.readdirSync(path, (err, fd) => {
            if (err) throw err
            this.fs.close(fd)
        })
        console.log('——————该文件下面有这些文件:', this.outPaths, '\n')
    }

    // 检索完成之后写入 index.html
    output() {
        try {
            let index = this.fs.readFileSync('index.html', 'utf8')

            // let readme = this.fs.readFileSync('README.md', 'utf8')
            // console.log('index:\n', index, '\n readme:\n', readme)

            this.outPaths.forEach(item => {
                this.fs.stat(this.path + '/' + item, (err, stats) => {
                    if (err) console.log(err)
                    // OK 只保存当天的文件，当天修改的话还是有重复
                    // OK 去 index 文件搜索，如果有就不加
                    let temp = stats.mtimeMs
                    let checkTime = this.timeCheck(temp)
                    let checkRepeat = this.repeatCheck(index, item)
                    // console.log(checkRepeat)
                    if (!checkTime || !checkRepeat) {
                        console.log(
                            '因为这个文件已经添加过了，再见，我下线了\n'
                        )
                    } else {
                        // TODO 让其再看文件源码的时候换行，方便维护，而不是只再HTML渲染的时候换行
                        // TODO 可将项目地址提取成环境变量
                        let htmlInner = `<a href="./${this.path}/${item}">${item}</a><br/>`
                        // DES markdown超链接的方式 [文件名](地址)
                        let mdInner = `> [${item}](https://www.adba.club/CSS-Inspired-Factory/${this.path}/${item})<br/>`

                        this.fs.appendFileSync(
                            'index.html',
                            htmlInner,
                            'utf8',
                            fd => {
                                this.fs.close(fd)
                            }
                        )

                        this.fs.appendFileSync(
                            'README.md',
                            mdInner,
                            'utf8',
                            fd => {
                                this.fs.close(fd)
                            }
                        )

                        console.log('——————添加完毕，我下线了')

                        // this.fs.close(index)
                    }
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

    timeCheck(yesterday) {
        let date = new Date(),
            day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear()

        // 2020-03-20
        let unix = +new Date(year + '-' + month + '-' + day)

        // 只保存当天的
        if (yesterday < unix) {
            return false
        }
        return true
    }
}

try {
    let file = new FileCheck()
    if (typeof process.argv[2] === 'undefined') {
        throw Error('你需要输入一个文件夹名')
    }
    let path = process.argv[2]
    console.log('——————即将检索文件夹:', path, '\n')
    file.input(path)
    file.output()
} catch (error) {
    console.log(error)
}
