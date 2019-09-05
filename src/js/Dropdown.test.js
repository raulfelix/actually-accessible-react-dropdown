import React from 'react';
import {mount} from 'enzyme';

import Dropdown from './Dropdown';

describe('Dropdown', () => {
    const options = [
        {label: 'Label 1', value: 0}
    ];

    describe('label', () => {
        it('should render when provided', () => {
            const wrapper = mount(
                <Dropdown
                  id="test1"
                  label="Select label"
                  options={options}
                  onSelect={jest.fn()}
                />
            );
            expect(wrapper.find('.control__label').length).toEqual(1);
            expect(wrapper.find('.control__label').text()).toEqual('Select label');
        });

        it('should not render when it does not exist', () => {
            const wrapper = mount(
                <Dropdown
                  id="test1"
                  options={options}
                  onSelect={jest.fn()}
                />
            );
            expect(wrapper.find('.control__label').length).toEqual(0);
        });
    });
});
