import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled, { css, createGlobalStyle } from "styled-components/macro";
import mobileAndTabletCheck from "components/shared/mobileAndTabletCheck";
import Loadable from "react-loadable";

import Nav from "components/layout/nav";
import SocialNav from "components/layout/socialNav";
import BackgroundVideo from "components/container/backgroundVideo";
import Loader from "components/shared/loaders/loader";

import ReactGA from "react-ga";
ReactGA.initialize("UA-65251724-4");
ReactGA.pageview(window.location.pathname + window.location.search);

const Inicio = Loadable({
  loader: () => import("components/pages/inicio"),
  loading: Loader
});

const Cortometrajes = Loadable({
  loader: () => import("components/pages/cortometrajes/cortometrajes"),
  loading: Loader
});

const Produccion = Loadable({
  loader: () => import("components/pages/produccion/produccion"),
  loading: Loader
});

const Prensa = Loadable({
  loader: () => import("components/pages/prensa/prensa"),
  loading: Loader
});

const NoMatch = Loadable({
  loader: () => import("components/pages/404"),
  loading: Loader
});

const Styles = createGlobalStyle`
  html {
      background-color: #000000;
      color: #fff;
      line-height:1.15;
      -webkit-text-size-adjust:100%;
      -webkit-font-smoothing: antialiased;
      box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
      box-sizing: inherit;
  }

  body {
      font-family: inherit;
      display: block;
      font-size: 17px;
      overflow: hidden;
      margin:0;
      font-family: 'Share', Arial, Helvetica, sans-serif;
  }

  /* normalize */
  a{background-color:transparent}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}  
`;

const AppContainer = styled.div`
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  display: flex;
  justify-content: center;
  transition: opacity 0.3s ease-in;
  ${props =>
    props.visible &&
    css`
      transition: opacity 0.3s ease-in;
      opacity: 1;
    `}
`;

function webpCheck() {
  if (window.Modernizr.webp) {
    return true;
  } else {
    return false;
  }
}

function App(props) {
  const [hasLoaded, setLoaded] = useState(false);

  const mobile = mobileAndTabletCheck();
  const webp = webpCheck();

  useEffect(() => {
    authenticate().then(() => {
      const loader = document.getElementById("outsideLoader");
      if (loader) {
        setLoaded(true);
        setTimeout(() => {
          // transition out
          loader.style.opacity = "0";
          setTimeout(() => {
            // remove from DOM
            loader.remove();
          }, 500);
        }, 500);
      }
    });
  });

  // fake authentication Promise
  function authenticate() {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }

  // preload all lazy components but the current one
  var preloadPages = (function() {
    var pagesLoaded = false;
    var path = window.location.pathname.toString();
    return function() {
      if (!pagesLoaded) {
        if (path.localeCompare("/") !== 0) {
          Inicio.preload();
        }
        if (path.localeCompare("/produccion") !== 0) {
          Produccion.preload();
        }
        if (path.localeCompare("/prensa") !== 0) {
          Prensa.preload();
        }
        if (path.localeCompare("/cortometrajes") !== 0) {
          Cortometrajes.preload();
        }
        pagesLoaded = true;
      }
    };
  })();

  return (
    <AppContainer visible={hasLoaded}>
      <Styles />
      <Router>
        <Nav preloadPages={preloadPages} />
        <SocialNav />
        <BackgroundVideo webp={webp} />
        <Route
          render={({ location }) => {
            return (
              <Switch location={location}>
                <Route
                  name="inicio"
                  exact
                  path="/"
                  component={() => (
                    <Inicio hasLoaded={hasLoaded} mobile={mobile} webp={webp} />
                  )}
                />
                <Route
                  exact
                  path="/produccion"
                  component={() => <Produccion mobile={mobile} webp={webp} />}
                />
                <Route
                  exact
                  path="/cortometrajes"
                  component={() => (
                    <Cortometrajes mobile={mobile} webp={webp} />
                  )}
                />
                <Route
                  exact
                  path="/prensa"
                  component={() => <Prensa mobile={mobile} webp={webp} />}
                />
                <Route component={() => <NoMatch mobile={mobile} />} />
              </Switch>
            );
          }}
        />
      </Router>
    </AppContainer>
  );
}

export default App;
