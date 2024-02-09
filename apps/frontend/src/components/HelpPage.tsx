import React from "react";
import "./styles/HelpPage.css";

export const HelpPage = () => {
  return (
    <div className="help-page-container">
      <div>
        Thank you for choosing Brigham & Women's Hospital Navigation Program to
        assist you during your visit to our medical facility. We understand that
        navigating a hospital can sometimes be overwhelming, which is why we've
        designed this program to make your experience as smooth and stress-free
        as possible.
      </div>
      <div>
        Interactive Map: Explore our hospital layout with an interactive map
        feature. You can zoom in, zoom out, and even get directions to your
        desired destination.
      </div>
      <div>
        Search for Locations: Click on the dot at which you are located and then
        another dot represent a specific department, clinic, or amenity within
        the hospital.
      </div>
      <div>
        Contact{" "}
        <a href="mailto:softengc24G@gmail.com?subject=Question%20about%20Hospital%20Navigation">
          softengc24G@gmail.com
        </a>{" "}
        for questions
      </div>
    </div>
  );
};
