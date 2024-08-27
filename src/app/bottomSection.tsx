<div className="mt-4 flex-grow" id="scatterplot-container">
<h2 className="text-lg font-bold ml-8">
  Heat worry and Heat rating of all counties
</h2>
<figure className="w-full h-full ">
  <ParentSize>
    {({ width, height, top, left }) => {
      return (
        <Scatterplot
          data={data}
          width={width}
          height={height}
          xVariable={xVariable}
          yVariable={yVariable}
          colorVariable={colorVariable}
        ></Scatterplot>
      );
    }}
  </ParentSize>
</figure>
</div>
{isDesktop && (
<div className="annotation-section mt-4">
  {/* Annotation content */}
</div>
)}
{isDesktop ? (
<aside className="w-full desktop:w-1/3 flex-shrink-0 pr-1 flex flex-col">
  <Button
    asChild
    className="bg-[#E8E8E8] w-full min-h-[4rem] text-xl rounded-none text-slate-950 font-bold"
  >
    <Link href="/login">Explore Mode &gt;&nbsp;</Link>
  </Button>
  <div className="mt-4 mb-1 ">
    <b className="text-xl">3143 Counties</b> in the US
  </div>
  <div className="table-container grow overflow-hidden">
    {/* <ParentSize>
    {({ width, height }) => {
      return (
        <DataTableDemo
          data={data}
          colorScale={colorScale}
          height={height}
          xVariable={xVariable}
          yVariable={yVariable}
          colorVariable={colorVariable}
        ></DataTableDemo>
      );
    }}
  </ParentSize> */}
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
) : (
<div className="table-container">
  <DataTableDemo data={data}></DataTableDemo>
</div>
)}