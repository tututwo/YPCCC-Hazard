import React from "react";

export const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={98 * 5}
        height={113 * 6}
        viewBox="0 0 98 113"
        fill="none"
      >
        <defs>
          <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "violet" }} />
            <stop offset="16.67%" style={{ stopColor: "indigo" }} />
            <stop offset="33.33%" style={{ stopColor: "blue" }} />
            <stop offset="50%" style={{ stopColor: "green" }} />
            <stop offset="66.67%" style={{ stopColor: "yellow" }} />
            <stop offset="83.33%" style={{ stopColor: "orange" }} />
            <stop offset="100%" style={{ stopColor: "red" }} />
          </linearGradient>
        </defs>
        <path
          d="M74.2997 91.8724L65.2224 76.1457C51.673 84.3284 33.8583 81.1324 24.0783 68.2417C13.613 54.4497 16.3117 34.7857 30.1037 24.3217C35.7144 20.0657 42.2957 17.9857 48.8343 17.9471L48.7743 0.952389C38.6703 1.00172 28.4983 4.20572 19.8303 10.7831C-1.43899 26.9204 -5.60032 57.2457 10.5397 78.5124C16.6077 86.5124 24.6837 92.0831 33.5304 95.0697L28.369 109.627C28.0703 110.562 28.549 111.352 28.841 111.603C29.201 111.91 29.841 112.103 30.3624 112.006C50.437 108.24 66.181 98.6804 74.2997 91.8724Z"
          stroke="#58595B"
          strokeWidth={1}
          fill="none"
        />
        <path
          d="M87.5614 20.0729C86.4267 18.5782 85.2121 17.1756 83.9467 15.8502L71.6641 27.5929C72.4907 28.4569 73.2827 29.3716 74.0227 30.3476C78.3294 36.0249 80.4041 42.6942 80.3947 49.3089L97.3894 49.4129C97.4241 39.1809 94.2254 28.8556 87.5614 20.0729Z"
          stroke="#00B48D"
          strokeWidth={1}
          fill="none"
        />
        <path
          d="M97.3895 49.4128L80.3948 49.3088C80.3855 55.0688 78.7962 60.7888 75.7148 65.7715L90.1415 74.7555C94.8922 67.0888 97.3588 58.2861 97.3895 49.4128Z"
          stroke="#FDBE10"
          strokeWidth={1}
          fill="none"
        />
        <path
          d="M81.633 85.1224C79.0917 87.7051 76.821 89.8104 74.2997 91.8717L65.2224 76.1464C66.1704 75.5757 67.0984 74.9504 67.9984 74.2651C68.7384 73.7051 69.4397 73.1117 70.1157 72.4997L81.633 85.1224Z"
          stroke="#BD7CB6"
          strokeWidth={1}
          fill="none"
        />
        <path
          d="M70.1158 72.5C72.3345 70.4893 74.2038 68.2187 75.7145 65.7707L90.1425 74.7547C87.6745 78.4347 85.1745 81.664 81.6332 85.1227L70.1158 72.5Z"
          stroke="#AF1C3F"
          strokeWidth={1}
          fill="none"
        />
        <path
          id="blue-band"
          d="M71.6288 27.6035L83.9115 15.8608C74.5048 6.02085 61.6822 0.899518 48.7395 0.963518L48.7995 17.9582C57.1995 17.9062 65.5235 21.2235 71.6288 27.6035Z"
          stroke="#59C5EF"
          strokeWidth={1}
          fill="none"
        />
      </svg>
    </div>
  );
};
