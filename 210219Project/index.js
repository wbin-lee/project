async function setRenderBackground() {
    const result = await axios.get("https://picsum.photos/1280/720", {
        responseType: "blob"    
    });
    const data = URL.createObjectURL(result.data);
    document.querySelector("body").style.backgroundImage = `url(${data})`
}
function Greetings() {
    const data = new Date();
    const greeting = document.querySelector(".timer-content");
        
    if (data.getHours() < 12) {
        greeting.textContent = "Good Morning, Woobin"
    }
    else {
        greeting.textContent = "Good Evening, Woobin"
    }
}

async function ClimateIcon() {
    let latitude = '';
    let longitude = '';
    try {
        const position = await getPosition();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    } catch (error) {
        console.log(error);
    } finally {
    const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=a1d40f9fc15f45531d6c16c62a85d2ec`)
    const CurrentWeather = data.data.list[0].weather[0].main;
    document.querySelector(".modal-button").style.backgroundImage = `url("${matchIcon(CurrentWeather)}")`;
    }
}

function setTime() {
    const timer = document.querySelector(".timer");
    setInterval(()=> {
        const data = new Date();
        timer.textContent = `${("0"+data.getHours()).slice(-2)}:${("0"+data.getMinutes()).slice(-2)}:${("0"+data.getSeconds()).slice(-2)}`
    }, 1000);
}

function getMemo() {
    const memo = document.querySelector(".memo");
    const memoValue = localStorage.getItem("todo");
    memo.textContent = memoValue;
}

function setMemo() {
    const memoInput = document.querySelector(".memo-input");
    memoInput.addEventListener("keyup", function(e) {
        if (e.code === 'Enter' && e.target.value) {
            localStorage.setItem("todo", e.target.value);
            getMemo();
            memoInput.value = ""
        }
    })
}

function deleteMemo() {
    document.addEventListener("click", function(e) {
        if(e.target.classList.contains("memo")){
            localStorage.removeItem("todo")
            e.target.textContent = "";
        }
    })
}

function memos() {
    setMemo();
    getMemo();
    deleteMemo();
}

// 위도 경도 가져오기 (promis 화)
function getPosition(options) {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    })
}

async function getWeather(latitude, longitude) {
    if(latitude && longitude) {
        const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=a1d40f9fc15f45531d6c16c62a85d2ec`)
        return data;
    }
    const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=a1d40f9fc15f45531d6c16c62a85d2ec`)
    return data;
}

function matchIcon(weatherData) {
    if (weatherData === "Clear") return "./images/039-sun.png";
    if (weatherData === "Clouds") return "./images/001-cloud.png";
    if (weatherData === "Rain") return "./images/003-rainy.png";
    if (weatherData === "Snow") return "./images/006-snowy.png";
    if (weatherData === "Thunderstorm") return "./images/008-storm.png";
    if (weatherData === "Drizzle") return "./images/031-snowflake.png";
    if (weatherData === "Atmosphere") return "./images/033-hurricane.png";
  }

function weatherWrapperComponent(li) {
    
    const changeToCelsius = temp => (temp-273.15).toFixed(1);
    return `
    <div class="card shadow-sm bg-transparent mb-3 m-2 flex-grow-1">
            <div class="card-header text-white text-center">
                ${li.dt_txt.split(" ")[0]}
            </div>
            <div class="card-body d-flex">
                <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                    <h5 class="card-title">
                        ${li.weather[0].main}
                    </h5>
                    <img src="${matchIcon(li.weather[0].main)}" width:"60px" height="60px"/>
                    <p class="card-text">${changeToCelsius(li.main.temp)}도</p>
                </div>
            </div>
          </div>
    `
}

async function renderWeather() {
    let latitude = '';
    let longitude = '';
    try {
        const position = await getPosition();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    } catch (error) {
        console.log(error);
    } finally {
        const {data} = await getWeather(latitude, longitude);
        const weatherList = data.list.reduce((acc, cur) => {
            if(cur.dt_txt.indexOf("18:00:00") > 0 ) {
                acc.push(cur);
            }
            return acc;
        }, []);

        const modalBody = document.querySelector(".modal-body");
        modalBody.innerHTML = weatherList.reduce((acc, cur) =>{
            //컴포넌트 제작
            acc += (weatherWrapperComponent(cur));
            return acc;
        }, "");
    }
}

(function() {
    setRenderBackground();
    setInterval(() => {
        setRenderBackground();
    }, 5000);
    setTime();
    Greetings();
    ClimateIcon();
    memos();
    renderWeather();
})();
