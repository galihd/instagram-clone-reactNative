import React from "react";
import RootStackNavigation from "../src/navigations/RootStackNavigation";
import renderer from 'react-test-renderer'

jest.useFakeTimers()

describe('render testing',()=>{
        test('<RootStackNavigation/>', ()=>{
            const tree = renderer.create(<RootStackNavigation/>).toJSON()
            expect(tree).toMatchSnapshot()
        })

    }
)