import React, { ReactNode } from "react";
import renderer, { ReactTestRendererJSON } from "react-test-renderer";

import App from "../../app/index";

jest.mock("@expo-google-fonts/open-sans", () => ({
  useFonts: () => [true, null],
}));

jest.mock("expo-status-bar", () => ({
  StatusBar: jest.fn(() => null),
}));

jest.mock("../../context/userInfoContext", () => ({
  UserInfoProvider: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("<App />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<App />).toJSON() as ReactTestRendererJSON;
    expect(tree).toMatchSnapshot();
  });
});
