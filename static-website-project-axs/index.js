let count = 0;

function changeNumber(action) {
    if (action === 'up') {
        count++;  
    } else if (action === 'down') {
        count--;  
    }
    document.getElementById("number").innerHTML = count;
}

function getTargetRanges() {
    var inputValue = document.querySelector('input').value;
    console.log("Current Input Value: " + inputValue);
}

function displayList() {
    var inputValue = document.querySelector('input').value;
    var listContainer = document.getElementById("list-container");

    if (inputValue.trim() !== "") {
        // استرجاع العناصر المخزنة في localStorage
        var items = JSON.parse(localStorage.getItem('input-list')) || [];

        // إضافة العنصر الجديد إلى المصفوفة
        items.push({ text: inputValue, completed: false, priority: false });

        // حفظ المصفوفة المعدلة في localStorage
        localStorage.setItem('input-list', JSON.stringify(items));

        // تحديث القائمة المعروضة
        updateList(items);

        listContainer.style.display = "block";

        // مسح حقل الإدخال بعد الحفظ
        document.querySelector('input').value = "";
        document.getElementById("add-btn").disabled = true;  // تعطيل الزر بعد الإضافة
    } else {
        alert("Please enter some text before submitting");
    }
}

// دالة لتحديث عرض العناصر في القائمة
function updateList(items) {
    var ul = document.getElementById("input-list");
    ul.innerHTML = ''; // تفريغ القائمة القديمة

    // إضافة العناصر المخزنة إلى القائمة
    items.forEach(function(item, index) {
        var li = document.createElement('li');
        
        // إضافة مربع اختيار لتحديد ما إذا كانت المهمة مكتملة أم لا
        var checkBox = document.createElement('input');
        checkBox.type = "checkbox";
        checkBox.id = "checkbox-" + index;  // تعيين id فريد لكل checkbox بناءً على الفهرس (index)
        checkBox.checked = item.completed;  // تعيين حالة المربع بناءً على البيانات المخزنة
        checkBox.onclick = function() {
            toggleCompletion(index, checkBox.checked);
        };
        
        // إضافة نص المهمة مع أولوية اللون الأحمر
        var textSpan = document.createElement('span');
        textSpan.textContent = item.text;  // تعيين النص من البيانات المخزنة
        if (item.priority) {
            textSpan.classList.add("priority");  // إضافة فئة الأولوية
        }
        if (item.completed) {
            textSpan.classList.add("completed");  // إضافة فئة المهام المكتملة
        }

        // إنشاء زر تعديل
        var editBtn = document.createElement('button');
        editBtn.textContent = "Edit";
        editBtn.onclick = function() {
            editItem(index, textSpan);  // عند النقر على تعديل
        };

        // إنشاء زر لحذف العنصر
        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function() {
            deleteItem(index);
        };

        // إضافة العناصر إلى العنصر (li)
        li.appendChild(checkBox);
        li.appendChild(textSpan);
        li.appendChild(editBtn);  // إضافة زر التعديل
        li.appendChild(deleteBtn);

        ul.appendChild(li);
    });
}

// دالة لتعديل العنصر عند النقر على زر التعديل
function editItem(index, textSpan) {
    // العثور على العنصر (li) الحاوي للنص
    var li = textSpan.closest('li'); 
    li.classList.add('editMode');  // إضافة فئة editMode

    // تحويل النص إلى حقل إدخال
    var input = document.createElement('input');
    input.type = 'text';
    input.value = textSpan.textContent;  // تعيين قيمة حقل الإدخال إلى النص الحالي
    input.onblur = function() {  // عند فقدان التركيز، حفظ التغييرات
        saveEditedItem(index, input.value);
    };
    input.onkeydown = function(event) {
        if (event.key === "Enter") {  // عند الضغط على Enter، حفظ التغييرات
            saveEditedItem(index, input.value);
        }
    };
    textSpan.innerHTML = '';  // مسح النص القديم
    textSpan.appendChild(input);  // إضافة حقل الإدخال داخل النص
}


// دالة لحفظ التعديلات في localStorage
function saveEditedItem(index, newText) {
    var items = JSON.parse(localStorage.getItem('input-list')) || [];
    items[index].text = newText;  // تحديث النص

    // حفظ المصفوفة المعدلة في localStorage
    localStorage.setItem('input-list', JSON.stringify(items));

    // تحديث القائمة
    updateList(items);
}

// دالة لحذف العنصر من localStorage
function deleteItem(index) {
    var items = JSON.parse(localStorage.getItem('input-list')) || [];

    // حذف العنصر من المصفوفة
    items.splice(index, 1);

    // حفظ المصفوفة المعدلة في localStorage
    localStorage.setItem('input-list', JSON.stringify(items));

    // تحديث القائمة
    updateList(items);
}

// دالة لتغيير حالة إكمال العنصر
function toggleCompletion(index, isChecked) {
    var items = JSON.parse(localStorage.getItem('input-list')) || [];
    items[index].completed = isChecked;  // تحديث حالة الإكمال

    // حفظ المصفوفة المعدلة في localStorage
    localStorage.setItem('input-list', JSON.stringify(items));

    // تحديث القائمة
    updateList(items);
}

// دالة لمسح جميع البيانات من localStorage
function clearStorage() {
    localStorage.removeItem('input-list');
    updateList([]); // تحديث القائمة بعد مسح البيانات
    alert('all text delet')

// دالة لتصفية المهام بناءً على حالتها
function filterTasks(status) {
    var items = JSON.parse(localStorage.getItem('input-list')) || [];
    var filteredItems = [];

    if (status === 'completed') {
        filteredItems = items.filter(item => item.completed);
    } else if (status === 'pending') {
        filteredItems = items.filter(item => !item.completed);
    } else {
        filteredItems = items;  // عرض الكل
    }

    updateList(filteredItems);

    // تحديث الأزرار النشطة
    var buttons = document.querySelectorAll('.filter-btns button');
    buttons.forEach(function(button) {
        button.classList.remove('active');
    });

    var activeButton = Array.from(buttons).find(button => button.textContent === status || status === 'all');
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// تم تحميل العناصر عند فتح الصفحة
window.onload = function() {
    var items = JSON.parse(localStorage.getItem('input-list')) || [];
    updateList(items);
}

// تم تفعيل تعطيل زر الإضافة عند الإدخال
document.getElementById("task-input").addEventListener("input", function() {
    var inputValue = this.value;
    document.getElementById("add-btn").disabled = !inputValue.trim();
})

}


