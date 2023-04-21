/**
 * 观察某个对象的所有属性
 * @param {Object} obj
 */
function observe(obj) {
    for (const key in obj) {
        let internalValue = obj[key];
        let funcs = [];
        Object.defineProperty(obj, key, {
            get() {
                // 哪个函数在用, 依赖收集
                console.log(`收集${key}`);
                if (window.__func && !funcs.includes(window.__func)) {
                    funcs.push(window.__func)
                }
                console.log(funcs);
                return internalValue
            },
            set(val) {
                internalValue = val;

                // 派发更新, 执行用我得函数

                for (let i = 0; i < funcs.length; i++) {
                    funcs[i]()
                }
            }
        })
    }
}


function autorun(fn) {
    window.__func = fn;
    fn()
    window.__func = null
}