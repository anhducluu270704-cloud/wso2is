
import React from "react"
import { render } from "@testing-library/react"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
} from "../tabs"

describe("Tabs primitives", () => {
  it("renders Tabs with orientation data attribute and combined className", () => {
    const { getByTestId } = render(
      <Tabs data-testid="tabs-root" className="custom-class">
        <div>Child</div>
      </Tabs>
    )

    const root = getByTestId("tabs-root")
    expect(root.getAttribute("data-slot")).toBe("tabs")
    expect(root.getAttribute("data-orientation")).toBe("horizontal")
    expect(root.className).toContain("group/tabs")
    expect(root.className).toContain("custom-class")
  })

  it("applies variant styles on TabsList", () => {
    const { getByTestId, rerender } = render(
      <Tabs>
        <TabsList data-testid="tabs-list-default">List</TabsList>
      </Tabs>
    )

    const defaultList = getByTestId("tabs-list-default")
    expect(defaultList.getAttribute("data-slot")).toBe("tabs-list")
    expect(defaultList.getAttribute("data-variant")).toBe("default")
    expect(defaultList.className).toContain(
      tabsListVariants({ variant: "default" })
    )

    rerender(
      <Tabs>
        <TabsList data-testid="tabs-list-line" variant="line">
          List
        </TabsList>
      </Tabs>
    )

    const lineList = getByTestId("tabs-list-line")
    expect(lineList.getAttribute("data-variant")).toBe("line")
    expect(lineList.className).toContain(
      tabsListVariants({ variant: "line" })
    )
  })

  it("renders TabsTrigger and TabsContent with data-slot attributes and classes", () => {
    const { getByTestId } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger data-testid="tabs-trigger" value="tab1">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent data-testid="tabs-content" value="tab1">
          Content 1
        </TabsContent>
      </Tabs>
    )

    const trigger = getByTestId("tabs-trigger")
    expect(trigger.getAttribute("data-slot")).toBe("tabs-trigger")
    expect(trigger.className).toContain("inline-flex")

    const content = getByTestId("tabs-content")
    expect(content.getAttribute("data-slot")).toBe("tabs-content")
    expect(content.className).toContain("w-full")
    expect(content.className).toContain("overflow-hidden")
  })
})

