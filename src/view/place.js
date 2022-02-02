import React, { useState, useEffect } from 'react';
import { getDataFromApi } from '../actions';

function Place({ cityName, onRemove }) {
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(0);
    const [img, setImg] = useState('');
    const [city, setCity] = useState('');
    const [temp, setTemp] = useState('');
    const [tempFill, setTempFill] = useState('');
    const [wind, setWind] = useState('');
    const [press, setPress] = useState('');
    const [description, setDescription] = useState('');
    useEffect(() => {
        getDataFromApi(cityName)
            .then(data => {
                setImg(data.weather[0].icon);
                setDescription(data.weather[0].description);
                setCity(data.name);
                setId(data.id);
                setTemp(data.main.temp);
                setTempFill(data.main.feels_like);
                setWind(data.wind.speed);
                setPress(data.main.pressure);
                setLoading(false);
            }).catch(e => {

            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cityName])

    if (loading) return <div className="placeholder"></div>;

    return (
        <li className="card">
            <div className="card__header">
                <h3>{city}</h3>
            </div>
            <div className="card__info">
                <img src={`http://openweathermap.org/img/wn/${img}@4x.png`} alt={description} />
                <div className="card__info_text">
                    <div className="card__info_temp">{temp}°</div>
                    <div className="card__info_fill"><span>Ощущается как&nbsp;</span>{Math.round(tempFill)}°</div>
                    <div className="card__info_wind"><img src="img/wind.svg" alt="wind" />Ветер: {Math.round(wind)} м/с</div>
                    <div className="card__info_press"><img src="img/press.svg" alt="pressure" />Атм. давление: {press} мм</div>
                </div>
            </div>
            <div className="card__footer">
                <h3>{description}</h3>
                <img src="img/del.svg" alt="remove" className="card__delbtn" onClick={e => onRemove(id)} />
            </div>
        </li>)
}

export default Place;