<main className="flex-grow flex flex-col desktop:flex-row desktop:flex-nowrap w-full border-4 m-4">
        {/* NOTE: This `flex-grow` here maintains the flex layout, eg. footer stays at the bottom, as overall height growing while the content grows on other parts */}
        <aside
          className={`flex-grow p-3 flex flex-col min-h-0 bg-gray-100 w-full transition-all duration-300 ease-in-out ${
            isSideBarOpen ? "desktop:max-w-[244px]" : "desktop:hidden"
          } space-y-4`}
          id="side-bar"
        >
          <div className="w-[180px] pl-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="US" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apple">US</SelectItem>
                  <SelectItem value="banana">Canada</SelectItem>
                  <SelectItem value="blueberry">UK</SelectItem>
                  <SelectItem value="grapes">China</SelectItem>
                  <SelectItem value="pineapple">India</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <h1 className="text-3xl font-bold px-4 py-2">
            Reality- Perception Gap
          </h1>

          <div className="flex-grow flex flex-col justify-between">
            <section className="mb-4 p-4 rounded">
             
            </section>
            {isDesktop && <footer className="mt-auto">2024</footer>}
          </div>
        </aside>

        <section className="w-full desktop:flex-grow p-4 flex flex-col">
          {isDesktop && (
            <div className="legend mb-4">
              {" "}
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Address" />
                <Button type="submit">Search</Button>
              </div>
            </div>
          )}
          <div className="flex-grow" id="map-container">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src="https://observablehq.com/embed/cadb3c4f5452d830?cells=viewof+selectedState%2Cmap"
            ></iframe>
          </div>
          <div className="mt-4" id="scatterplot-container">
            {/* D3.js scatterplot will be rendered here */}
          </div>
          {isDesktop && (
            <div className="annotation-section mt-4">
              {/* Annotation content */}
            </div>
          )}
        </section>

        {isDesktop && (
          <aside className="w-full desktop:max-w-[288px] p-4">
            <Button
              asChild
              className="bg-slate-400 w-full min-h-[4rem] text-xl "
            >
              <Link href="/login">Explore Mode &gt;&nbsp;</Link>
            </Button>
            <div className="table-container">
              <DataTableDemo></DataTableDemo>
            </div>

            <Button variant={"ghost"} className="w-full flex text-lg">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                className="scale-150"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              &nbsp;&nbsp;Download Data
            </Button>
          </aside>
        )}
      </main>