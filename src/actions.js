const propName = 'weatherdata';
const weatherApiKey = 'здес ключ от апи'
const defaultData = [{
    "id": 1486209,
    "name": "Екатеринбург"
},
{
    "id": 1508291,
    "name": "Челябинск"
}];

export const getDataFromApi = async cityId => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&lang=ru&appid=${weatherApiKey}`);
    if (response.status === 200) {
        return await response.json();
    } else {
        throw new Error(response.status)
    }
}

const getByCords = async () => {
    const cords = await new Promise((resolve, rej) => {
        navigator.geolocation.getCurrentPosition(pos => {
            resolve(pos)
        }, err => {
            rej();
        }, {
            enableHighAccuracy: true,
            timeout: 2000,
            maximumAge: 0
        })
    })
    const { latitude, longitude } = cords.coords;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`);
    if (response.status === 200) {
        const result = await response.json();
        return result.list.map(city => ({
            "id": city.id,
            "name": city.name
        }));
    } else {
        throw new Error('Not found')
    }
}

export const getDataFromStorage = () => async disp => {
    const payload = JSON.parse(localStorage.getItem(propName));
    if (payload) {
        disp({ type: 'DATA_LOADED', payload });
    } else {
        getByCords().then(city => {
            localStorage.setItem(propName, JSON.stringify(city));
            disp({ type: 'DATA_LOADED', payload: city });
        }).catch((ex) => {
            console.log(ex.message);
            localStorage.setItem(propName, JSON.stringify(defaultData));
            disp({ type: 'DATA_LOADED', payload: defaultData });
        })
    }
}

export const addCity = cityName => async disp => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${cityName}&appid=${weatherApiKey}`);
    if (response.status === 200) {
        const result = await response.json();
        if (result.count > 0) {
            const { name, id } = result.list[0];
            const storageCitys = JSON.parse(localStorage.getItem(propName));
            if (storageCitys && !storageCitys.find(e => e.id === id)) {
                const payload = [...JSON.parse(localStorage.getItem(propName)), { name, id }];
                localStorage.setItem(propName, JSON.stringify(payload));
                disp({ type: 'ADD_CITY', payload, cityName });
            } else {
                disp({ type: 'ADD_CITY_ERROR_ALREADY', cityName });
            }

        } else {
            disp({ type: 'ADD_CITY_ERROR_NOTFOUND', cityName });
        }
    } else {
        disp({ type: 'ADD_CITY_ERROR_NOTFOUND', cityName });
    }
}

export const removeCity = cityId => disp => {
    const payload = JSON.parse(localStorage.getItem(propName)).filter(city => city.id !== cityId);
    localStorage.setItem(propName, JSON.stringify(payload));
    disp({ type: 'REMOVE_CITY', payload, cityId });
}   
