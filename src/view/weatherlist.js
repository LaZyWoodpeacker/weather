import React, { useState, useEffect } from 'react';
import { getDataFromStorage, addCity, removeCity } from '../actions'
import { connect } from 'react-redux';
import Place from './place'

function WeatherList(props) {
    const [cityInput, setCityInput] = useState('');
    const [validate, setValidate] = useState(false);
    const [notify, setNotify] = useState(false);

    useEffect(() => {
        props.dispatch(getDataFromStorage());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (props.notify) {
            console.log(props.notify);
            setNotify(true);
            setTimeout(() => {
                setNotify(false);
                setCityInput('');
            }, 500);
        }
    }, [props.notify])

    if (!props.places) {
        return null
    }

    return (<>
        <ul>
            {props.places.map(city => <Place cityId={city.id} key={city.id} onRemove={id => {
                props.dispatch(removeCity(id));
            }}></Place>)}
        </ul>
        <div className="controls">
            <input type="text" placeholder='Город' value={cityInput || ''}
                onChange={e => {
                    setValidate(e.target.value.length > 0)
                    setCityInput(e.target.value)
                }}
            ></input>
            <button
                onClick={e => props.dispatch(addCity(cityInput))}
                disabled={!validate}
            >Добавить</button>
        </div>
        <div className="notify" style={{ display: notify ? 'flex' : 'none' }}>
            <div className="notify__message">{props.notify}</div>
        </div>
    </>)
}

export default connect(store => ({ ...store }))(WeatherList);