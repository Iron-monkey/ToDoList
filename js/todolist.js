$(function () {
    // 提前检索出需要多次引用的元素，避免重复选择，因为js检索DOM对象非常耗时。
    let ol = $('ol');
    let ul = $('ul');
    let ulAndOl = $('ul, ol');
    // 每次进入页面首先先加载数据
    load();

    // 1. 在title处按下回车则把数据存入本地存储
    $('.title').on('keydown', function (event) {
        // 回车键的ASCII码是13
        if (event.keyCode === 13) {
            // 获取到本地存储的数据
            let todoData = getData();
            // 写入数据
            todoData.push({
                    title: $(this).val(),
                    done: false
                }
            );
            // 把新的数据保存到本地存储
            saveDate(todoData);
            // 2. 把数据渲染到页面
            load();
            // 在添加完内容后清空text内的值
            $(this).val('');
        }
    });

    // 3. 删除操作

    ulAndOl.on('click', 'a', function () {
        // 获取数据
        let data = getData();
        // 删除数据
        // 利用原生splice函数
        data.splice($(this).attr('data-index'), 1);
        saveDate(data);
        load();
    });

    // 4. 正在进行和已经完成状态互相转换
    ulAndOl.on('click', 'input', function () {
        // ① 获取本地存储的数据
        let data = getData();
        // ②获取我点击的元素的索引值
        let index = $(this).siblings('a').attr('data-index');
        // ③ 更改元素check的值，让本地存储的元素保持同样的操作
        data[index].done = $(this).prop('checked');
        // ④ 保存数据
        saveDate(data);
        // ⑤ 重新渲染界面
        load();
    });

    // 函数获取本地存储数据
    function getData() {
        let data = localStorage.getItem('todolist');
        // 如果本地数据不为空则返回本地存储的数据
        if (data != null) {
            return JSON.parse(data)
        } else {
            // 如果本地存储为空，则返回空数组
            return []
        }
    }

    function saveDate(data) {
        localStorage.setItem('todolist', JSON.stringify(data));
    }

    function load() {
        // 计数
        let todoCount = 0;
        let doneCount = 0;
        // 先获取数据
        let data = getData();
        // 先清空ol里面的数据，防止重复渲染
        ulAndOl.empty();
        $.each(data, function (index, content) {
            if (content.done) {
                ul.prepend("<li>" +
                    "<input type='checkbox' checked='checked'>" +
                    "<p>" + content.title + "</p>" +
                    "<a href='javascript:' class='off' data-index=" + index + " ></a>" +
                    "</li>");
                doneCount++;
            } else {
                ol.prepend("<li>" +
                    "<input type='checkbox'>" +
                    "<p>" + content.title + "</p>" +
                    "<a href='javascript:' class='off' data-index=" + index + " ></a>" +
                    "</li>");
                todoCount++;
            }
        });
        $('#todoCount').html(todoCount);
        $('#doneCount').html(doneCount);
    }
});
