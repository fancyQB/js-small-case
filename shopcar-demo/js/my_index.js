
// 单件商品
class UIGoods {

    constructor(g) {
        // this.data = g;
        // this.choose = 0;
        g = { ...g }
        Object.freeze(g)
        let internalChooseValue = 0
        Object.defineProperties(this, {
            data: {
                configurable: false,
                get () {
                    return g;
                },
                set () {
                    throw new Error('can\'t set property data');
                }
            },
            choose: {
                configurable: false,
                get () {
                    return internalChooseValue;
                },
                set (value) {
                    if (typeof value !== 'number'){
                        throw new TypeError('choose\'s value type must be number');
                    }
                    let temp = parseInt(value) ;
                    if (temp !== value) {
                        throw new TypeError('choose\'s value type must be integer');
                    }
                    if (value < 0) {
                        throw new Error('choose\'s value type must be positive integer')
                    }
                    internalChooseValue = value

                }
            }
        })

    }

    // 获取单个商品总价
    // getTotlePrice = () => this.data.price * this.choose
    get TotlePrice() {
        return this.data.price * this.choose;
    }


    // 商品个数增加
    // increase = () => ++this.choose

    get increase () {
        return ++this.choose;
    }

    // 商品减少
    // decrease = () => this.choose > 0 ? --this.choose : this.choose

    get decrease () {
        return this.choose > 0 ? --this.choose : this.choose;
    }

    // 是否选中商品
    // isChoose = () => this.choose > 0

    get isChoose() {
        return this.choose > 0;
    }

}

// 界面数据
class UIData {

    constructor() {
        const uiGoods = [];
        for (const good of goods) {
            uiGoods.push(new UIGoods(good));
        }
        // this.uiGoods = uiGoods;
        Object.defineProperty(this, 'uiGoods', {
            configurable: false,
            get () {
                return uiGoods;
            },
            set () {
                throw new Error('can\'t set property uiGoods')
            }
        })
        this.deliveryThreshold = 30;
        this.deliveryPrice = 5;
    }

    // 选择商品个数
    getChooseGoodsNums = () => {
        let count = 0
        for (const good of this.uiGoods) {
            count += good.choose
        }
        return count
    }

    // 商品总价
    getTotlePrice = () => {
        let totalPrice = 0;
        for (const good of this.uiGoods) {
            totalPrice += good.TotlePrice;
        }
        return totalPrice
    }

    // 是否达到配送门槛
    isDeliveryThreshold = () => this.getTotlePrice() > this.deliveryThreshold


    // 商品增加
    increase = index => this.uiGoods[index].increase

    // 商品减少
    decrease = index => this.uiGoods[index].decrease

    // 商品是否被选中
    isChoose = index => this.uiGoods[index].isChoose

    // 是否在购物车中
    hasGoodsInCar = () => this.getChooseGoodsNums() > 0

}

// UI界面
class UI {

    constructor() {

        this.uiData = new UIData();
        console.log(this.uiData);
        this.doms = {
            goodsList: document.querySelector('.goods-list'),
            car: document.querySelector('.footer-car'),
            goodsNums: document.querySelector('.footer-car-badge'),
            goodsPrice: document.querySelector('.footer-car-total'),
            deliveryPrice: document.querySelector('.footer-car-tip'),
            footerPay: document.querySelector('.footer-pay'),
            footerPayInnerSpan: document.querySelector('.footer-pay span')

        }
        const carRect = this.doms.car.getBoundingClientRect();
        this.jumpTarget = {
            x: carRect.left + carRect.width / 2,
            y: carRect.top + carRect.height / 5
        }

        this.creatHtml();
        // this.updateFooter();
        this.EventListener();

    }
    // 创建html元素
    creatHtml = () => {
        // 字符串拼接
        let html = '';
        for (let i = 0; i < this.uiData.uiGoods.length; i++) {
            let g = this.uiData.uiGoods[i];
            html += `<div class="goods-item">
                <img src="${g.data.pic}" alt="" class="goods-pic">
                <div class="goods-info">
                    <h2 class="goods-title">${g.data.title}</h2>
                    <p class="goods-desc">${g.data.desc}</p>
                    <p class="goods-sell">
                    <span>月售 ${g.data.sellNumber}</span>
                    <span>好评率${g.data.favorRate}%</span>
                    </p>
                    <div class="goods-confirm">
                    <p class="goods-price">
                        <span class="goods-price-unit">￥</span>
                        <span>${g.data.price}</span>
                    </p>
                    <div class="goods-btns">
                        <i index="${i}" class="iconfont i-jianhao"></i>
                        <span>${g.choose}</span>
                        <i index="${i}" class="iconfont i-jiajianzujianjiahao"></i>
                    </div>
                    </div>
                </div>
                </div>`;
        }
        this.doms.goodsList.innerHTML = html;
        this.doms.deliveryPrice.textContent = `配送费￥${this.uiData.deliveryPrice}`;
        console.log(this.doms.footerPay);

        this.doms.footerPayInnerSpan.textContent = `还差￥${this.uiData.deliveryThreshold}元起送`
    }
    // 商品增加
    increase = index => {

        this.uiData.increase(index);
        this.updateGoodsItem(index);
        this.updateFooter();

        this.jump(index)


    }

    // 商品减少
    decrease = index => {
        this.uiData.decrease(index);
        this.updateGoodsItem(index);
        this.updateFooter();

        // this.jump(index);
    }

    // 更新商品界面
    updateGoodsItem = index => {
        const goodsDom = this.doms.goodsList.children[index];

        const span = goodsDom.querySelector('.goods-btns span');


        if (this.uiData.isChoose(index)) {

            goodsDom.classList.add('active');

        } else {

            goodsDom.classList.remove('active');
        }
        span.textContent = `${this.uiData.uiGoods[index].choose}`;

    }

    // 更新页脚
    updateFooter = () => {

        if (this.uiData.hasGoodsInCar()) {
            this.doms.car.classList.add('active');
        } else {
            this.doms.car.classList.remove('active');
        }

        this.doms.goodsNums.textContent = this.uiData.getChooseGoodsNums();
        this.doms.goodsPrice.textContent = this.uiData.getTotlePrice().toFixed(2);

        let dis = this.uiData.deliveryThreshold - this.uiData.getTotlePrice();
        if (this.uiData.isDeliveryThreshold()) {
            this.doms.footerPay.classList.add('active');
        } else {
            this.doms.footerPay.classList.remove('active');
            this.doms.footerPayInnerSpan.textContent = `还差￥${dis.toFixed(2)}元起送`;
        }


    }

    // 购物车动画
    carAnimate = () => this.doms.car.classList.add('animate')

    // 监听各种
    EventListener = () => {
        this.doms.car.addEventListener('animationend', () => {
            this.doms.car.classList.remove('animate')
        })
    }

    // 抛物线动画
    jump = index => {
        const btnAdd = this.doms.goodsList.children[index
        ].querySelector('.i-jiajianzujianjiahao')

        // 获取开始坐标
        const rect = btnAdd.getBoundingClientRect()
        console.log(rect);

        const start = {
            x: rect.left,
            y: rect.top
        }

        // 跳跃
        const div = document.createElement('div');
        div.classList.add('add-to-car');
        const i = document.createElement('i')
        i.classList.add('iconfont', 'i-jiajianzujianjiahao')

        div.style.transform = `translateX(${start.x}px)`;
        i.style.transform = `translateY(${start.y}px)`;
        div.appendChild(i)
        document.body.appendChild(div);

        // 强行渲染
        div.clientWidth;

        div.style.transform = `translateX(${this.jumpTarget.x}px)`;
        i.style.transform = `translateY(${this.jumpTarget.y}px)`

        div.addEventListener('transitionend', () => {
            div.remove();
            this.carAnimate();
        }), {
            once: true, // 事件仅触发一次
        }
        this.EventListener()

    }
}

const ui = new UI()

ui.doms.goodsList.addEventListener('click', e => {
    if (e.target.classList.contains('i-jiajianzujianjiahao')) {
        let index = e.target.getAttribute('index');
        ui.increase(index);
    } else if (e.target.classList.contains('i-jianhao')) {
        let index = e.target.getAttribute('index');
        ui.decrease(index)
    }
})



