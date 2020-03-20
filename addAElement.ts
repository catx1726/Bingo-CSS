class FileCheck {
    fs = require('fs')

    // 一个文件数组，存放所有需要生成节点的文件路径
    outPaths = []

    // 存放传入的根路径
    path = ''

    // 传入需要检索文件是否新增的路径
    input(path) {
        this.path = path
        this.outPaths = this.fs.readdirSync(path, err => {
            if (err) throw err
        })
        console.log(this.outPaths)
    }

    // 检索完成之后写入 index.html
    output() {
        try {
            let today = +new Date()
            this.outPaths.forEach(item => {
                this.fs.stat(this.path + '/' + item, (err, stats) => {
                    if (err) console.log(err)
                    // TODO 只保存当天的文件
                    let temp = stats.mtimeMs
                    let check = this.timeCheck(temp)
                    if (!check) {
                        console.log('只做了提交当天的文件')
                    } else {
                        let innerHtml = `<a href="./${this.path}/${item}"></a><br>`
                        this.fs.appendFileSync('index.html', innerHtml, 'utf8')
                    }
                })
            })
        } catch (error) {
            console.log(error)
        } finally {
            // 关闭fd
        }
    }

    timeCheck(yesterday) {
        let date = new Date(),
            day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear()

        // 2020-03-20
        let unix = +new Date(year + '-' + month + '-' + day)
        console.log(yesterday, unix)

        // 只保存当天的
        if (yesterday < unix) {
            return false
        }
        return true
    }

    test() {
        console.log('test')
    }
}

try {
    let file = new FileCheck()
    let path = process.argv[2]
    console.log('即将检索文件夹:', path)
    file.input(path)
    file.output()
} catch (error) {
    console.log(error)
}
// file.input('3M')
// file.output()
