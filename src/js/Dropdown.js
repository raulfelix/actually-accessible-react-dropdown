import PropTypes from 'prop-types';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import styled from 'styled-components';

import KEY_CODES from './KeyCodes';
import {
  handleListKeyUp,
  handleButtonKeyUp,
  adjustScrollPosition
} from './Utils';

const Control = styled.div`
  font-family: 'rubik', Arial;
  position: relative;

  ${({isActive}) => isActive && `
    ${ControlList} {
      display: block;
    }

    ${Trigger} {
      border-radius: 2px 2px 0 0;
    }
  `}
`
const ControlLabel = styled.div`
  position: relative;
  label {
    color: #666;
    display: block;
    margin-bottom: 10px;
  }
`
const ControlField = styled.div`
  position: relative;
`
const ControlList = styled.ul`
  box-sizing: border-box;
  background: #fff;
  border-radius: 0;
  box-shadow: 0 0 12px rgba(0,0,0,.2);
  display: none;
  max-height: 240px;
  margin: 0;
  overflow-y: auto;
  padding: 0px;
  position: absolute;
  top: 44px;
  width: 100%;
  z-index: 100;

  &:focus {
    outline: 0;
    box-shadow: rgba(8, 132, 252, 0.3) 0px 0px 0px 3px;
  }
`
const ListItem = styled.li`
  height: 40px
  line-height: 40px;
  list-style: none;
  margin: 0;
  padding: 0 10px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #f5f5f5;
  }

  ${({isSelected}) => isSelected && `
    background-color: #dddddd;
  `}
`
const Trigger = styled.button`
  background-color: #fff;
  box-sizing: border-box;
  border: 1px solid #dddddd;
  border-radius: 2px;
  display: block;
  font-size: 16px;
  margin-bottom: 0;
  min-height: 40px;
  overflow: hidden;
  padding: 7px 40px 7px 0.65rem;
  position: relative;
  width: 100%;
  white-space: nowrap;
  text-align: left;
  text-overflow: ellipsis;

  &:focus {
    outline: 0;
    box-shadow: rgba(8, 132, 252, 0.3) 0px 0px 0px 3px;
    z-index: 1;
  }
`
const TriggerIcon = styled.span`
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 40px;
  &:after {
    content: '';
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #000;
  }
`

function focusTriggerButton(id) {
  document.getElementById(`${id}-button`).focus();
}

const getActiveItem = (index, options, placeholder) => index < 0 ? { label: placeholder } : options[index]

const Dropdown = function({ id, label, options, placeholder, onSelect }) {
  const [isActive, setIsActive] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(function() {
    setActiveIndex(options.findIndex(o => o.isActive))
  }, [])

  useLayoutEffect(function() {
    if (isActive) {
      document.getElementById(`${id}-list`).focus();
      adjustScrollPosition(`${id}-list`, `${id}-item-${activeIndex}`);
    }
  })

  function onActivate() {
    setIsActive(true)
  }

  function onOptionClick(o, i) {
    setActiveIndex(i)
    onItemSelect(o);
  }

  function onItemSelect(item) {
    if (isActive === false) {
      return;
    }

    if (item) {
      setIsActive(false)
      setTimeout(() => focusTriggerButton(id), 100)
      onSelect(item);
    }
  }

  function onBlur() {
    reset();
  }

  function setActiveItem(newIndex) {
    let idx = newIndex;
    if (idx >= options.length) {
      idx = 0;
    } else if (idx < 0) {
      idx = options.length - 1;
    }

    adjustScrollPosition(`${id}-list`, `${id}-item-${idx}`);
    setActiveIndex(idx)
  }

  function onKeyDown(e) {
    switch (e.key) {
      case KEY_CODES.RETURN:
        onItemSelect(getActiveItem(activeIndex, options, placeholder));
        break;
      case KEY_CODES.DOWN:
        setActiveItem(activeIndex + 1)
        if (!isActive) {
          onActivate();
        }
        e.preventDefault();
        break;
      case KEY_CODES.UP:
        setActiveItem(activeIndex - 1);
        onActivate();
        e.preventDefault();
        break;
      case KEY_CODES.END:
        e.preventDefault();
        setActiveItem(options.length - 1);
        break;
      case KEY_CODES.HOME:
        e.preventDefault();
        setActiveItem(0);
        break;
      case KEY_CODES.ESC:
        reset(true);
        break;
      default:
        break;
     }
  }

  function reset(isFocusTriggerRequired) {
    const idx = activeIndex;
    adjustScrollPosition(`${id}-list`, `${id}-item-${idx}`);
    setIsActive(false)
    if (isFocusTriggerRequired) {
      setTimeout(() => focusTriggerButton(id), 100)
    }
  }

  return (
    <Control isActive={isActive} className="control">
      {
        label && (
          <ControlLabel className="control__label">
            <label
              htmlFor={`${id}-label`}
              onClick={() => document.getElementById(`${id}-button`).focus()}
            >{label}</label>
          </ControlLabel>
        )
      }
      <ControlField className="control__field">
        <Trigger
          id={`${id}-button`}
          type="button"
          className="dropdown__btn control__field-input"
          aria-haspopup="listbox"
          aria-labelledby={`${id}-label ${id}-button`}
          aria-expanded={isActive}
          onClick={() => onActivate()}
          onKeyUp={e => handleButtonKeyUp(e)}
          onKeyDown={e => onKeyDown(e)}
        >
          {getActiveItem(activeIndex, options, placeholder).label}
          <TriggerIcon role="presentation" aria-hidden="true" />
        </Trigger>
        <ControlList
          id={`${id}-list`}
          className="list dropdown__list"
          tabIndex="-1"
          role="listbox"
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-item-${activeIndex}`}
          onKeyUp={e => handleListKeyUp(e)}
          onKeyDown={e => onKeyDown(e)}
          onBlur={e => onBlur(e)}
        >
          {
            options.map((o, i) => (
              <ListItem
                key={o.value}
                id={`${id}-item-${i}`}
                role="option"
                title={o.label}
                isSelected={i === activeIndex}
                aria-selected={i === activeIndex}
                onClick={() => onOptionClick(o, i)}
              >
                  {o.label}
              </ListItem>
            ))
          }
        </ControlList>
      </ControlField>
    </Control>
  )
}

Dropdown.defaultProps = {
  label: '',
  placeholder: 'Please select'
};

Dropdown.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string
};

export default Dropdown;