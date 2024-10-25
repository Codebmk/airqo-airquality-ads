"use client";
import { useEffect, useState } from "react";
import { getAQDataApi, getCohorts, getDailyPredictions, getGridsSummary, getGridMeasurements } from "@utils/apis";
import { useWindowSize } from "@utils/windowSize";
import { useParams, useRouter } from 'next/navigation';
import Image from "next/image";
import GoodAir from "@icons/GoodAir";
import Hazardous from "@icons/Hazardous";
import Moderate from "@icons/Moderate";
import Unhealthy from "@icons/Unhealthy";
import UnhealthySG from "@icons/UnhealthySG";
import VeryUnhealthy from "@icons/VeryUnhealthy";
import UnknownAQ from "@icons/Invalid";
import WindIcon from "@icons/WindIcon";
import AnalyticsQR from "public/analytics_qrcode.png"
import OopsSVG from "public/Oops.svg";

const BoxWrapper = ({ children }) => {
  const window = useWindowSize();
  const screenWidth = window.width;

  if (!screenWidth) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`w-screen h-screen overflow-hidden bg-blue-600 flex flex-col gap-2`}
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

const AirQualityDetails = ({ data, predictions, isPredictionsLoading, name, type }) => {
  const window = useWindowSize();
  const screenWidth = Math.floor(window.width);

  const getAQIMessage = (aqi_category) => {
    if (aqi_category !== "") {
      return `Air quality is ${aqi_category}`;
    } else {
      return "";
    }
  };

  const getAQIIcon = (reading, size) => {
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
        width={`${size}px`}
        height={`${size}px`}
      />
    );
  };

  const renderPredictions = () => {
    const days = ['S', 'S', 'M', 'T', 'W', 'T', 'F'];
    const today = new Date().getDay();

    return (
      <div className="absolute top-full left-0 mt-4 flex items-center justify-start w-full">
        {[...Array(7)].map((_, index) => {
          const dayIndex = (today + index) % 7;
          const isToday = index === 0;
          const forecast = predictions && predictions[index];
          const date = forecast ? new Date(forecast.time) : new Date();
          date.setDate(date.getDate() + index);

          return (
            <div 
              key={index} 
              className={`flex flex-col items-center mr-2 rounded-md p-1 ${
                isToday 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-200 bg-opacity-30 text-white'
              }`}
            >
              <span className="font-bold" style={{fontSize: `${screenWidth * 0.01}px`}}>{days[dayIndex]}</span>
              <span style={{fontSize: `${screenWidth * 0.009}px`}}>{date.getDate()}</span>
              {isPredictionsLoading ? (
                <div className="animate-pulse bg-gray-500 rounded-full mt-1" style={{width: `${screenWidth * 0.025}px`, height: `${screenWidth * 0.025}px`}}></div>
              ) : forecast ? (
                <div className="mt-1">{getAQIIcon(forecast.pm2_5, screenWidth * 0.025)}</div>
              ) : (
                <div className="mt-1">
                  <UnknownAQ width={`${screenWidth * 0.025}px`} height={`${screenWidth * 0.025}px`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`w-full h-full px-[5%] pt-[3%] bg-blue-950 border-t-2 border-blue-950 overflow-hidden relative`}
    >
    <div className="absolute top-0 left-0 w-full bg-blue-900 py-2 px-4 z-10">
        <div className="flex items-center gap-4 text-white" style={{fontSize: `${screenWidth * 0.012}px`}}>
          <div className="font-bold">Air Quality</div>
          <div>
            {new Date().toLocaleDateString([], {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div>
            {new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
          <div className="capitalize">{name}</div>
        </div>
      </div>
      <div className="w-full h-[67%] flex justify-between items-start gap-1 relative mt-6">
        <div className="flex justify-between items-start w-full">
          <div className="w-full">
            <div className="flex-col justify-between items-start w-full relative">
              <div className="self-stretch flex-col justify-start items-start flex">
                <div className="flex justify-start items-center gap-4">
                  <div
                    className="p-1 bg-blue-100 rounded-full flex justify-center items-center"
                    style={{
                      width: `${screenWidth * 0.04}px`,
                      height: `${screenWidth * 0.04}px`,
                    }}
                  >
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
              <div className="flex justify-start items-baseline gap-[11.18px] relative">
                <div
                  className={`text-center text-orange-400 font-extrabold font-['Inter']`}
                  style={{fontSize: `${screenWidth * 0.08}px`}}
                >
                  {data && data.pm2_5
                    ? data.pm2_5.value.toFixed(2)
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
                {renderPredictions()}
              </div>
            </div>
          </div>
          <div className="w-full justify-end items-start flex py-[1%]">
            {data && data.pm2_5 && (
              <div
                className={`w-[${screenWidth * 0.20}px] h-[${screenWidth * 0.20}px] justify-center items-center flex`}
              >
                {getAQIIcon(data.pm2_5.value, screenWidth * 0.18)}
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{
          position: "absolute",
          bottom: "5%",
          right: "10%"
        }}>
        <div style={{fontSize: `${screenWidth * 0.02}px`, color:"#fff", fontWeight: "600"}}>SCAN ME</div>
        <Image src={AnalyticsQR} width={screenWidth*0.1} height={screenWidth*0.1} alt="analytics qr code" />
      </div>
      <div className="h-auto w-full">
        <div
          className={`w-full text-neutral-50 leading-snug font-semibold font-['Inter']`}
          style={{fontSize: `${screenWidth * 0.02}px`}}
        >
          {data && data.aqi_category
            ? getAQIMessage(data.aqi_category)
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
              {data && data.siteDetails
                ? data.siteDetails.name
                : "--"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [selectedData, setSelectedData] = useState(null);
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [predictions, setPredictions] = useState(null);
  const [isPredictionsLoading, setIsPredictionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [type, setType] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = process.env.NEXT_PUBLIC_API_TOKEN;
      try {
        if (params.params && params.params.length === 2) {
          const [paramType, paramName] = params.params;
          setType(paramType.toLowerCase() === 'cohort' ? 'Cohort' : 'Grid');
          
          if (paramType.toLowerCase() === 'cohort') {
            const response = await getCohorts(accessToken);
            if (response.success && Array.isArray(response.cohorts)) {
              const matchedCohort = response.cohorts.find(cohort => cohort.name.toLowerCase() === paramName.toLowerCase());
              if (matchedCohort) {
                setId(matchedCohort._id);
                setName(matchedCohort.name);
              } else {
                throw new Error(`Cohort "${paramName}" not found`);
              }
            } else {
              throw new Error("Invalid response format from getCohorts");
            }
          } else if (paramType.toLowerCase() === 'grid') {
            const gridsSummary = await getGridsSummary(accessToken);
            const matchedGrid = gridsSummary.grids.find(grid => grid.name.toLowerCase() === paramName.toLowerCase());
            if (matchedGrid) {
              setId(matchedGrid._id);
              setName(matchedGrid.name);
            } else {
              throw new Error(`Grid "${paramName}" not found`);
            }
          }
        } else {
          // Default to car_free_day_demo cohort if no params
          setType('Cohort');
          const response = await getCohorts(accessToken);
          const defaultCohort = response.cohorts.find(cohort => cohort.name.toLowerCase() === "car_free_day_demo");
          if (defaultCohort) {
            setId(defaultCohort._id);
            setName(defaultCohort.name);
          } else {
            throw new Error("Default cohort not found");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, [params.params]);

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!id || !type) return;

      try {
        const accessToken = process.env.NEXT_PUBLIC_API_TOKEN;
        let response;
        if (type === 'Cohort') {
          response = await getAQDataApi(accessToken, id);
          if (response.measurements && response.measurements.length > 0) {
            const availableSites = response.measurements.filter(site => site.pm2_5 && site.pm2_5.value);
            if (availableSites.length === 0) {
              throw new Error(`No measurements found for any device in ${name}`);
            }
            const randomSite = availableSites[Math.floor(Math.random() * availableSites.length)];
            setSelectedData(randomSite);
            if (randomSite.site_id) {
              setIsPredictionsLoading(true);
              const forecasts = await getDailyPredictions(accessToken, randomSite.site_id);
              setPredictions(forecasts || []);
              setIsPredictionsLoading(false);
            }
          } else {
            throw new Error(`No measurements found for ${name}`);
          }
        } else if (type === 'Grid') {
          response = await getGridMeasurements(accessToken, id);
          if (response.success && response.measurements && response.measurements.length > 0) {
            const availableSites = response.measurements.filter(site => site.pm2_5 && site.pm2_5.value);
            if (availableSites.length === 0) {
              throw new Error(`No measurements found for any device in grid ${name}`);
            }
            const randomSite = availableSites[Math.floor(Math.random() * availableSites.length)];
            setSelectedData(randomSite);
            if (randomSite.site_id) {
              setIsPredictionsLoading(true);
              const forecasts = await getDailyPredictions(accessToken, randomSite.site_id);
              setPredictions(forecasts || []);
              setIsPredictionsLoading(false);
            }
          } else {
            throw new Error(`No measurements found for grid ${name}`);
          }
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching measurements:", error);
        setError(error.message);
      }
    };

    if (id && type) {
      fetchMeasurements();
      const interval = setInterval(fetchMeasurements, 20000);
      return () => clearInterval(interval);
    }
  }, [id, type, name]);

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-blue-950 text-white">
        <Image src={OopsSVG} alt="Error" width={200} height={200} />
        <h1 className="text-2xl font-bold mt-4">{error}</h1>
        <p className="mt-2">Please try again later or select a different {type.toLowerCase()}.</p>
      </div>
    );
  }

  return (
    <BoxWrapper>
      <AirQualityDetails 
        data={selectedData} 
        predictions={predictions} 
        isPredictionsLoading={isPredictionsLoading}
        name={name}
        type={type}
      />
    </BoxWrapper>
  );
}
