// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
    {"kind": "Мангустин", "color": "фиолетовый", "weight": 6},
    {"kind": "Дуриан", "color": "зеленый", "weight": 8},
    {"kind": "Личи", "color": "розово-красный", "weight": 10},
    {"kind": "Карамбола", "color": "желтый", "weight": 12},
    {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 15}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

const priority = ['розово-красный', 'желтый', 'зеленый',  'фиолетовый', 'светло-коричневый']

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
    fruitsList.innerHTML = '';
    for (let i = 0; i < fruits.length; i++) {

        var li = document.createElement("li");
        li.className = 'fruit__item ' + 'fruit_' + i;

        var div_info = document.createElement("div");
        div_info.className = 'fruit__info';

        var div_index = document.createElement("div");
        div_index.innerText = 'index: ' + i;
        div_info.appendChild(div_index);

        var div_kind = document.createElement("div");
        div_kind.innerText = 'kind: ' + fruits[i].kind;
        div_info.appendChild(div_kind);

        var div_color = document.createElement("div");
        div_color.innerText = 'color: ' + fruits[i].color;
        div_info.appendChild(div_color);

        var div_weight = document.createElement("div");
        div_weight.innerText = 'weight (кг): ' + fruits[i].weight;
        div_info.appendChild(div_weight);

        li.appendChild(div_info);
        // и добавляем в конец списка fruitsList при помощи document.appendChild
        fruitsList.appendChild(li);
    }
    for (let i = 0; i < fruits.length; i++) {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        num_1 = getRandomInt(255);
        num_2 = getRandomInt(255);
        num_3 = getRandomInt(255);
        color = 'rgb(' + num_1 + ', ' + num_2 + ', ' + num_3 + ')';
        document.querySelector('.fruit_' + i).style.backgroundColor = color;
    }
    
};

// первая отрисовка карточек
display();


/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
    let result = [];
    let tmp = fruits.slice();

    while (fruits.length > 0) {
        var num = getRandomInt(0, fruits.length - 1);
        result.push(fruits[num]);
        fruits.splice(num, 1);
    }
    if(JSON.stringify(tmp) != JSON.stringify(result)){
        fruits = result;
    } else{
        alert("Перемешать не удалось!");
        fruits = tmp;
    }
};

shuffleButton.addEventListener('click', () => {
    shuffleFruits();
    display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
    var min = document.querySelector('.minweight__input').value;
    var max = document.querySelector('.maxweight__input').value;
    if(min == '' || max == ''){
        return fruits;
    }
    fruits = fruits.filter((item) => {
        return (item.weight >= min && item.weight <= max);
    });
};

filterButton.addEventListener('click', () => {
    filterFruits();
    display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
    const priority1 = priority.indexOf(a.color);
    const priority2 = priority.indexOf(b.color);
    return priority1 > priority2;
};

const sortAPI = {
    bubbleSort(arr, comparation) {
        const n = arr.length;
        for (let i = 0; i < n-1; i++) { 
            for (let j = 0; j < n-1-i; j++) { 
                if (comparation(arr[j], arr[j+1])) { 
                    let temp = arr[j+1]; 
                    arr[j+1] = arr[j]; 
                    arr[j] = temp; 
                }
            }
        }
        return arr;
    },

    // функция быстрой сортировки
    quickSort(arr, comparation) {
        if (arr.length < 2) {
            return arr;
        }else{
            let num = Math.floor(arr.length / 2);
            const pivot = arr[num];
            const less = arr.filter(value => comparationColor(pivot, value));
            const greater = arr.filter(value => comparationColor(value, pivot));
            return[...sortAPI.quickSort(less), pivot, ...sortAPI.quickSort(greater)];
        }
    },

    // выполняет сортировку и производит замер времени
    startSort(sort, arr, comparation) {
        const start = new Date().getTime();
        fruits = sort(arr, comparation);
        const end = new Date().getTime();
        sortTime = `${end - start} ms`;
    },
};

// инициализация полей
sortKindLabel.textContent = sortKind;

sortChangeButton.addEventListener('click', () => {
    if(sortKind == 'bubbleSort'){
        sortKind = 'quickSort';
    }else{
        sortKind = 'bubbleSort';
    }
    sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
    const sort = sortAPI[sortKind];
    if(sortKind == 'bubbleSort'){
        sortAPI.startSort(sortAPI.bubbleSort, fruits, comparationColor);
    }else{
        sortAPI.startSort(sortAPI.quickSort, fruits, comparationColor);
    }
    sortTimeLabel.textContent = sortTime;
    display();
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
    if(kindInput.value == '' || colorInput.value == '' || weightInput.value == ''){
        alert('Заполните все поля');
        return fruits;
    }
    let new_fruit = {
        kind: kindInput.value,
        color: colorInput.value,
        weight: Number(weightInput.value)
    };
    priority.push(colorInput.value);
    fruits.push(new_fruit);
    display();
});