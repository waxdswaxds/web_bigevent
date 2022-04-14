$(function() {

    let layer = layui.layer
        // 获取表单
    let form = layui.form
        // 分页
    var laypage = layui.laypage;

    //定义美化时间的过滤器 
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date()

        const y = dt.getFullYear()
        const m = padZero(dt.getMonth() + 1)
        const d = padZero(dt.getDate())
        const hh = padZero(dt.getHours())
        const mm = padZero(dt.getMinutes())
        const ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义 补零 函数

    function padZero(n) {
        return n < 10 ? '0' + n : n
    }


    // 定义一个查询的参数对象。将来请求数据的时候
    //需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, //	页码值
        pagesize: 2, //	每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }
    initTable()
    initCate()

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // console.log(res.data);
                let htmlStr = template('tpl-table', res)
                    // console.log(htmlStr);
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        });
    }
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                // console.log(res.data);
                let htmlStr = template('tpl-cates', res)
                $('[name=cate_id]').html(htmlStr)
                    // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定筛选事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            //获取表单中选中的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
            // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
            // 根据最新的筛选条件，重新渲染
        initTable()
    });

    //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //分页容器的 ID 
            count: total, //总数居条数
            limit: q.pagesize, //每页显示几条数据
            limits: [2, 3, 5, 10],
            curr: q.pagenum,
            layout: ['count', 'limit', 'page', 'next', 'prev', 'skip'],
            //指定默认被选中的分页
            //页面发送切换时候，触发 jump 回调
            // 触发 jump 回调的方式有两种
            // 1.点击页码的时候会触发
            // 2.只要调用了 laypag() 方法就会触发 jump 函数
            jump: function(obj, first) {
                // console.log(obj.curr);
                //把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagenum // 根据最新的 q 获取对应的数据列表并渲染表格 
                q.pagesize = obj.limit //得到每页显示的条数
                    //首次不执行
                if (!first) {
                    //do something
                    initTable()

                }
            }
        })
    }

    // 通过代理的形似,为删除按钮绑定点击事件处理函数
    $('body').on('click', '.btn-delete', function() {
        // console.log('ok');.btn-delete
        //获取删除按钮的个数
        let len = $('.btn-delete').length
        console.log(len);
        //获取 删除的 id 
        let id = $(this).attr('data-id')
            // console.log(id);

        //询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功败')
                        //当数据删除完成后,需要判断当前这一页中,是否还有剩余数据,如果没有剩余数据后,让页码值 -1 之后,重新调用 innittable() 方法
                    if (len = 1) {
                        //如果 len = 1 证明页面上没有数据了
                        //页码值最小必须是 1 
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    initTable()
                }
            });

            layer.close(index);
        });
    })


})