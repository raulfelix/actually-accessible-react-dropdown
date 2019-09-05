import PropTypes from 'prop-types';
import React from 'react';
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
    span {
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
    padding-right: 32px;
    padding: 7px 1rem 7px 0.65rem;
    position: relative;
    width: 100%;
    white-space: nowrap;
    text-align: left;

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
    }
`

class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        let activeIndex = -1;

        this.props.options.forEach((o, idx) => {
            if (o.isActive === true) {
                activeIndex = idx;
            }
        });

        this.placeholder = {
            label: this.props.placeholder
        };
        this.state = {
            isActive: false,
            selectedItem: this.props.options[activeIndex],
            activeIndex
        };
    }

    onActivate() {
        this.setState({
            isActive: true
        }, () => {
            document.getElementById(`${this.props.id}-list`).focus();
            adjustScrollPosition(`${this.props.id}-list`, `${this.props.id}-item-${this.state.activeIndex}`);
        });
    }

    onOptionClick(o, i) {
        this.setState({
            activeIndex: i
        });
        this.onItemSelect(o);
    }

    onItemSelect(item) {
        if (this.state.isActive === false) {
            return;
        }

        if (item) {
            this.setState({
                isActive: false,
                selectedItem: item
            }, () => setTimeout(() => this.focusTriggerButton(), 100));

            this.props.onSelect(item);
        }
    }

    /**
     * When the enter key is pressed get the focussed item
     * and apply the selection.
     * @param {Object} e
     */
    onKeyDown(e) {
        const key = e.which || e.keyCode;
        const {activeIndex} = this.state;

        switch (key) {
            case KEY_CODES.RETURN:
                this.onItemSelect(this.getActiveItem());
                break;
            case KEY_CODES.DOWN:
                this.setActiveItem(activeIndex + 1);
                this.onActivate();
                e.preventDefault();
                break;
            case KEY_CODES.UP:
                this.setActiveItem(activeIndex - 1);
                this.onActivate();
                e.preventDefault();
                break;
            case KEY_CODES.END:
                e.preventDefault();
                this.setActiveItem(this.props.options.length - 1);
                break;
            case KEY_CODES.HOME:
                e.preventDefault();
                this.setActiveItem(0);
                break;
            case 'esc':
                this.reset(true);
                break;
            default:
                break;
        }
    }

    onBlur() {
        this.reset();
    }

    onButtonKeyDown(e) {
        this.onKeyDown(e);
    }

    setActiveItem(newIndex) {
        let idx = newIndex;

        if (idx >= this.props.options.length) {
            idx = 0;
        } else if (idx < 0) {
            idx = this.props.options.length - 1;
        }

        adjustScrollPosition(`${this.props.id}-list`, `${this.props.id}-item-${idx}`);

        this.setState({
            activeIndex: idx
        });
    }

    getActiveItem() {
        const {activeIndex} = this.state;

        if (activeIndex < 0) {
            return this.placeholder;
        }
        return this.props.options[activeIndex];
    }

    getSelectedItem() {
        if (this.state.selectedItem) {
            return this.state.selectedItem;
        }
        return this.placeholder;
    }

    getListItemCSS(i) {
        if (this.props.options[i] === this.state.selectedItem) {
            return 'list__item list__item--selected';
        }
        return i === this.state.activeIndex ? 'list__item list__item--active' : 'list__item';
    }

    reset(isFocusTriggerRequired) {
        // find the active item
        const idx = this.props.options.findIndex(o => o === this.state.selectedItem);
        adjustScrollPosition(`${this.props.id}-list`, `${this.props.id}-item-${idx}`);

        this.setState({
            isActive: false,
            activeIndex: idx
        }, () => {
            if (isFocusTriggerRequired) {
                this.focusTriggerButton();
            }
        });
    }

    focusTriggerButton() {
        document.getElementById(`${this.props.id}-button`).focus();
    }

    render() {
        return (
            <Control isActive={this.state.isActive} className="control">
                {
                    this.props.label && (
                        <ControlLabel className="control__label">
                            <span htmlFor={`${this.props.id}-label`}>{this.props.label}</span>
                        </ControlLabel>
                    )
                }
                <ControlField className="control__field">
                    <Trigger
                      id={`${this.props.id}-button`}
                      type="button"
                      className="dropdown__btn control__field-input"
                      aria-haspopup="listbox"
                      aria-labelledby={`${this.props.id}-label ${this.props.id}-button`}
                      aria-expanded={this.state.isActive}
                      onClick={() => this.onActivate()}
                      onKeyUp={e => handleButtonKeyUp(e)}
                      onKeyDown={e => this.onButtonKeyDown(e)}
                    >
                        {this.getSelectedItem().label}
                        <TriggerIcon />
                    </Trigger>
                    <ControlList
                      id={`${this.props.id}-list`}
                      className="list dropdown__list"
                      tabIndex="-1"
                      role="listbox"
                      aria-labelledby={`${this.props.id}-label`}
                      aria-activedescendant={`${this.props.id}-item-${this.state.activeIndex}`}
                      onKeyUp={e => handleListKeyUp(e)}
                      onKeyDown={e => this.onKeyDown(e)}
                      onBlur={e => this.onBlur(e)}
                    >
                        {
                            this.props.options.map((o, i) => (
                                <ListItem
                                  key={o.value}
                                  id={`${this.props.id}-item-${i}`}
                                  role="option"
                                  title={o.label}
                                  isSelected={i === this.state.activeIndex}
                                  aria-selected={i === this.state.activeIndex}
                                  className={this.getListItemCSS(i)}
                                  onClick={() => this.onOptionClick(o, i)}
                                >
                                    {o.label}
                                </ListItem>
                            ))
                        }
                    </ControlList>
                </ControlField>
            </Control>
        );
    }
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
