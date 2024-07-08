"use client";
import { useEffect, useState } from "react";
import { getAQDataApi } from "@components/utils/apis";
import { useWindowSize } from "@components/utils/windowSize";
import Image from "next/image";
import GoodAir from "@icons/GoodAir";
import Hazardous from "@icons/Hazardous";
import Moderate from "@icons/Moderate";
import Unhealthy from "@icons/Unhealthy";
import UnhealthySG from "@icons/UnhealthySG";
import VeryUnhealthy from "@icons/VeryUnhealthy";
import UnknownAQ from "@icons/Invalid";
import WindIcon from "@icons/WindIcon";

const BoxWrapper = ({ children }) => {
  const window = useWindowSize();
  const screenWidth = window.width;
  return (
    <div
      className={`${
        screenWidth >= 2160
          ? "w-screen h-screen overflow-hidden"
          : "w-screen min-h-screen h-full overflow-x-hidden"
      } p-8 bg-blue-600 flex flex-col gap-2`}
    >
      {children}
    </div>
  );
};

const Footer = () => {
  return (
    <div className="w-full h-auto bg-blue-500 rounded-3xl flex shadow justify-center items-center">
      <Image
        src="/airqo_logo.png"
        alt="AirQo logo"
        width={103.97}
        height={103.97}
      />
      <Image
        src="/MUK_Logo.png"
        alt="Makerere university logo"
        width={105.82}
        height={104.11}
      />
    </div>
  );
};

const AirQualityDetails = (site) => {
  const window = useWindowSize();
  const screenWidth = Math.floor(window.width);
  const [selectedSite, setSelectedSite] = useState(null);

  const getAQIMessage = (aqi_category, healthTip) => {
    if (aqi_category !== "") {
      return `Air quality is ${aqi_category}`;
    } else {
      return "";
    }
  };

  const getAQIIcon = (reading) => {
    let AirQualityIcon = null;

    if (reading >= 0 && reading <= 12) {
      AirQualityIcon = GoodAir;
    } else if (reading > 12 && reading <= 35.4) {
      AirQualityIcon = Moderate;
    } else if (reading > 35.4 && reading <= 55.4) {
      AirQualityIcon = UnhealthySG;
    } else if (reading > 55.4 && reading <= 150.4) {
      AirQualityIcon = Unhealthy;
    } else if (reading > 150.4 && reading <= 250.4) {
      AirQualityIcon = VeryUnhealthy;
    } else if (reading > 250.4 && reading <= 500) {
      AirQualityIcon = Hazardous;
    } else {
      AirQualityIcon = UnknownAQ;
    }

    return (
      <AirQualityIcon
        width={`${screenWidth * 0.18}`}
        height={`${screenWidth * 0.18}`}
      />
    );
  };

  useEffect(() => {
    if (site) {
      setSelectedSite(site.site);
    }
  }, [site]);

  console.log(screenWidth * 0.04)

  return (
    <div
      className={`${
        screenWidth >= 2160 ? "h-full" : "h-4/5 min-h-[620px]"
      } w-full rounded-3xl px-[5%] pt-[3%] bg-blue-950 border-t-2 border-blue-950 overflow-hidden relative`}
    >
      <div className="w-full flex-col justify-start items-start gap-1 flex">
        <div className="flex-col justify-start items-start flex">
          <div className="flex justify-start items-start divide-x-2 divide-white">
            <div
              className={`text-neutral-50 font-medium font-['Inter'] pr-5 leading-tight`}
              style={{fontSize: `${screenWidth * 0.015}px`}}
            >
              {new Date().toLocaleDateString([], {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div
              className={`text-neutral-50 font-medium font-['Inter'] leading-tight pl-5`}
              style={{fontSize: `${screenWidth * 0.015}px`}}
            >
              {new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
          <div
            className={`text-neutral-50 font-bold font-['Inter'] leading-tight`}
            style={{fontSize: `${screenWidth * 0.05}px`}}
          >
            Air Quality
          </div>
        </div>
        <div className="w-full justify-between items-center flex py-[1%]">
          <div className="flex-col justify-between items-start w-full">
            <div className="self-stretch flex-col justify-start items-start flex">
              <div className="flex justify-start items-center gap-4">
                <div
                  className="p-1 bg-blue-100 rounded-full flex justify-center items-center"
                  style={{
                    width: `${screenWidth * 0.04}px`,
                    height: `${screenWidth * 0.04}px`,
                  }}
                >
                  {/* <Image
                    src="/wind.png"
                    alt="Image X"
                    width={screenWidth * 0.04}
                    height={screenWidth * 0.04}
                    style={{ objectFit: "contain" }}
                  /> */}
                  <WindIcon
                  width={`${screenWidth * 0.035}`}
                  height={`${screenWidth * 0.035}`} />
                </div>
                <div
                  className={`text-right text-neutral-50 font-medium font-['Inter'] leading-tight`}
                  style={{fontSize: `${screenWidth * 0.03}px`}}
                >
                  PM2.5
                </div>
              </div>
            </div>
            <div className="flex justify-start items-baseline gap-[11.18px]">
              <div
                className={`text-center text-orange-400 font-extrabold font-['Inter']`}
                style={{fontSize: `${screenWidth * 0.08}px`}}
              >
                {selectedSite && selectedSite.pm2_5
                  ? selectedSite.pm2_5.value.toFixed(2)
                  : "--"}
              </div>
              <div className="text-right">
                <span
                  className={`text-orange-400 font-bold font-['Inter']`}
                  style={{fontSize: `${screenWidth * 0.03}px`}}
                >
                  μg/m
                </span>
                <span
                  className={`text-orange-400 font-medium font-['Inter']`}
                  style={{fontSize: `${screenWidth * 0.03}px`}}
                >
                  3
                </span>
              </div>
            </div>
          </div>
          {selectedSite && selectedSite.pm2_5 && (
            <div
              className={`${`w-[${screenWidth * 0.20}px] h-[${screenWidth * 0.20}px]`} justify-center items-center flex`}
            >
              {getAQIIcon(selectedSite.pm2_5.value)}
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-[7%] right-[5%] left-[5%]">
      <div
        className={`max-w-[60%] w-full text-neutral-50 leading-snug font-semibold font-['Inter']`}
        style={{fontSize: `${screenWidth * 0.02}px`}}
      >
        {selectedSite && selectedSite.aqi_category
          ? getAQIMessage(
              selectedSite.aqi_category,
              selectedSite.health_tips[0].description
            )
          : ""}
      </div>
        <hr className="pb-4 mt-5" />
        <div className="h-[99.60px] flex-col justify-start items-start gap-4 flex">
          <div className="justify-center items-center gap-5 inline-flex">
            <div>
              <Image
                src="/marker.png"
                alt="Image 0"
                width={screenWidth >= 2160 ? 83 : 48}
                height={screenWidth >= 2160 ? 83 : 48}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div
              className={`text-neutral-50 leading-loose font-bold font-['Inter']`}
              style={{fontSize: `${screenWidth * 0.02}px`}}
            >
              {selectedSite && selectedSite.siteDetails
                ? selectedSite.siteDetails.search_name
                : "--"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = process.env.NEXT_PUBLIC_API_TOKEN;
        const response = await getAQDataApi(token);
        if (response.success) {
          // choose random site
          const randomIndex = Math.floor(
            Math.random() * response.measurements.length
          );
          let randomSite = response.measurements[randomIndex];
          if (!selectedSite) {
            setSelectedSite(randomSite);
          } else {
            while (randomSite.site_id === selectedSite?.site_id) {
              randomSite =
                response.measurements[
                  Math.floor(Math.random() * response.measurements.length)
                ];
            }
          }
          setSelectedSite(randomSite);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 100000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <BoxWrapper>
      <AirQualityDetails site={selectedSite} />
      <Footer />
    </BoxWrapper>
  );
}
