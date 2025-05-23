import ionRangeSlider from 'ion-rangeslider';
import $ from 'jquery';
import { set } from 'lodash';
import { useState } from '../helpers/helpers';


export default function popupFormPlanning() {
    //data-popup-form-planning



    const ranges = initRanges();
    const visibility = popupVisibilityHandler();
    console.log('popup-form-planning', document.querySelectorAll('[data-plannings-popup-checkbox]'));
    
    document.body.addEventListener('click', function checkboxCheckOnPopupOpen(evt){
        const el = evt.target.closest('[data-plannings-popup-checkbox]');
        if (!el) {
            return;
        }
        const dataset = el.dataset.planningsPopupCheckbox;
    
        document.querySelector('[name="' + dataset + '"]').checked = true;
    });
    
}

function popupVisibilityHandler() {
    const [ isOpen, setIsOpen, subscribeIsOpen ] = useState(false);
    const popup = document.querySelector('[data-popup-form-planning]');
    document.body.addEventListener('click',function planningPopupOpen(evt){
        const target = evt.target.closest('[data-popup-form-planning-open]');
        if (!target) {
            return;
        }
        setIsOpen(true);
    });

    document.body.addEventListener('click',function planningPopupClose(evt){
        const target = evt.target.closest('[data-popup-form-planning-close]');
        if (!target) {
            return;
        }
        setIsOpen(false);
    });

    subscribeIsOpen((value) => {
        if (value) {
            popup.classList.add('active');
            document.body.classList.add('popup-open');
        } else {
            popup.classList.remove('active');
            document.body.classList.remove('popup-open');
        }
    })

    return {
        isOpen,
        setIsOpen,
        subscribeIsOpen
    }

}

function initRanges() {
    let ranges = [];
    document.querySelectorAll('[data-form-planning-range]').forEach((el) => {
        const rangeSlider = $(el);
        console.log('popup-form-planning');
        rangeSlider.ionRangeSlider({
            type: 'double',
            grid: false,
            min: el.dataset.min,
            max: el.dataset.max,
            // hide_from_to: true,
            // hide_min_max: true,
            from: el.dataset.from,
            to: el.dataset.to,
            step: el.dataset.step ? el.dataset.step : 1,
            // onStart: updateInputs,
            // onChange: updateInputs,
            onFinish(e) {
                const inputFrom = document.querySelector(`[name="${el.dataset.rangeChangeFrom}"]`);
                const inputTo = document.querySelector(`[name="${el.dataset.rangeChangeTo}"]`);
                const from = e.from;
                const to = e.to;
                inputFrom.value = from;
                inputTo.value = to;
                
            },
            // onUpdate: updateInputs,
        });
        const instance = rangeSlider.data('ionRangeSlider');

        ranges.push(instance);
    });

    return ranges;
}