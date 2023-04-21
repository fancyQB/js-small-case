

const obj = {
    username: '张三',
    birth: '2000-01-01'
}
observe(obj)
function getFirstName() {
    if (isLegalStr()) {
        document.querySelector('.firstname span').textContent = obj.username[0];
    } else {
        throw new Error('the incoming params is illegal')
    }


}

function getLastName() {

    document.querySelector('.lastname span').textContent = obj.username.slice(1)

}

function getAge() {
    const birthday = new Date(obj.birth);
    const today = new Date();
    today.setHours(0), today.setMinutes(0), today.setMilliseconds(0);
    thisYearBirthday = new Date(
        today.getFullYear(),
        birthday.getMonth(),
        birthday.getDate()
    );
    let age = today.getFullYear() - birthday.getFullYear();
    if (today.getTime() < thisYearBirthday.getTime()) {
        age--;
    }
    document.querySelector('.birth span').textContent = age;
}


const isLegalStr = () => typeof obj.username === 'string' && obj.username.length >= 2

autorun(getFirstName)
autorun(getLastName)
autorun(getAge)
