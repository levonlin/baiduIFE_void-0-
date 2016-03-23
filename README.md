# void(0)队任务提交处
各位代码调好就可以给这个dev分支发pr了，这样既可以集中代码，也方便review时进行对比。提交前先注意统一一下格式：

* 对于各自独立完成的任务，为防止冲突，文件名最后请加上自己的名字，如`index_levon.html`；协作的任务就不必这样，直接提交就好。
* 核对好目录结构：stagem/taskn（m、n为数字）。

获取大家已提交的代码：
```
    git remote add o git@github.com:levonlin/ife_void0.git
    git pull o dev
    # 如果你本地也是在dev分支下进行开发的，为防止你的文件和pull下来的dev分支冲突，建议还是先建立一个空分支专门用来pull大家的代码
```
