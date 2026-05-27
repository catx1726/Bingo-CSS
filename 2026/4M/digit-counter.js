class DigitCounter {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.digitHeight = options.digitHeight || 60;
        this.init();
    }

    init() {
        this.container.classList.add('digit-counter');
        // 初始化时显示的位应该直接显示
        this.update(0);
        this.container.querySelectorAll('.digit-wrapper').forEach(w => w.classList.add('show'));
    }

    createDigitColumn() {
        const wrapper = document.createElement('div');
        wrapper.className = 'digit-wrapper';
        wrapper.style.height = `${this.digitHeight}px`;
        
        const strip = document.createElement('div');
        strip.className = 'digit-strip';
        
        for (let i = 0; i <= 9; i++) {
            const digit = document.createElement('div');
            digit.className = 'digit';
            digit.style.height = `${this.digitHeight}px`;
            digit.style.lineHeight = `${this.digitHeight}px`;
            digit.innerText = i;
            strip.appendChild(digit);
        }
        wrapper.appendChild(strip);
        return wrapper;
    }

    update(target) {
        const targetStr = target.toString();
        
        // 1. 动态扩容
        const currentWrappers = this.container.querySelectorAll('.digit-wrapper');
        if (targetStr.length > currentWrappers.length) {
            const diff = targetStr.length - currentWrappers.length;
            for (let i = 0; i < diff; i++) {
                const newCol = this.createDigitColumn();
                newCol.querySelector('.digit-strip').style.transform = `translateY(0px)`;
                this.container.insertBefore(newCol, this.container.firstChild);
                newCol.offsetWidth; // 强制重排
                newCol.classList.add('show'); // 触发淡入
            }
        }
        
        // 确保现有的位数都处于可见状态
        this.container.querySelectorAll('.digit-wrapper').forEach(w => w.classList.add('show'));
        
        // 2. 渲染数值
        const paddedStr = targetStr.padStart(this.container.querySelectorAll('.digit-wrapper').length, '0');
        const strips = Array.from(this.container.querySelectorAll('.digit-strip')).reverse();
        
        strips.forEach((strip, index) => {
            const val = parseInt(paddedStr[paddedStr.length - 1 - index] || 0);
            const duration = 1.5 - (index * 0.4);
            
            strip.style.transition = `transform ${Math.max(0.5, duration)}s cubic-bezier(0.19, 1, 0.22, 1)`;
            strip.style.transitionDelay = `${index * 0.1}s`;
            strip.style.transform = `translateY(-${val * this.digitHeight}px)`;
        });
    }
}
