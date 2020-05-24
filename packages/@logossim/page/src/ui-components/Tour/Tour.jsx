import React, { Component } from 'react';
import GitHubButton from 'react-github-button';
import Joyride, { ACTIONS, EVENTS } from 'react-joyride';

import styled, { keyframes } from 'styled-components';

import Key from '../Key/Key';
import bifurcation from './images/bifurcation.gif';
import contextMenu from './images/context-menu.gif';
import simulation from './images/simulation.gif';
import wire from './images/wire.gif';
import { DIMENSIONS } from './tourCircuit';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }

  55% {
    background-color: rgba(42, 8, 69, 0.5);
    transform: scale(1.2);
  }
`;

const Pulse = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  animation: ${pulse} 1s ease-in-out infinite;
  background-color: ${props => props.color};
  border: 1px solid rgba(42, 8, 69, 0.7);
  border-radius: 50%;

  height: ${props => props.size}px;
  width: ${props => props.size}px;
`;

const Beacon = React.forwardRef((props, ref) => (
  <Pulse
    size={30}
    color="rgba(100, 65, 165, 0.3)"
    ref={ref}
    {...props}
  >
    <Pulse size={20} color="rgba(100, 65, 165, 0.5)" />
  </Pulse>
));

const imageStyle = {
  alignSelf: 'center',
  borderRadius: 25,
  boxShadow: 'rgba(171, 171, 171, 0.38) 0px 13px 20px 0px',
  marginBottom: 16,
};

export default class Tour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      steps: [
        {
          title: 'Welcome!',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img
                src={`${process.env.PUBLIC_URL}/social.png`}
                alt="logossim's logo"
                style={{
                  width: 300,
                  height: 158,
                  alignSelf: 'center',
                }}
              />
              <p>
                This is <strong>logossim</strong>: an open source
                digital logic simulator, built for the web and to be
                extensible.
              </p>
              <p>Would you like to take a quick tour?</p>
            </div>
          ),
          target: 'body',
          placement: 'center',
          showProgress: false,
          disableOverlayClose: false,
          locale: {
            skip: 'No, thanks',
            next: 'Yes, please!',
          },
        },
        {
          target: '#tour-circuit-area-wrapper',
          title: 'This is the circuit workstation',
          content: (
            <p>
              Here&apos;s where you are going to draw your circuits
            </p>
          ),
        },
        {
          target: '#component-select-button',
          title: 'Adding components',
          content: (
            <span>
              <p>And you&apos;ll start by adding some components.</p>
              <p>
                You can do it by clicking on this button, then
                you&apos;ll see all available components, so you can
                create awesome circuits...
              </p>
              <p>
                <strong>Hint:</strong> use the
                <Key size={24}>CTRL</Key>
                <Key size={24}>A</Key> shortcut.
              </p>
            </span>
          ),
          placement: 'top',
        },
        {
          target: '#tour-circuit-wrapper',
          title: 'Adding components',
          content: <p>... like this one, for example!</p>,
          spotlightPadding: 30,
        },
        {
          target: '#tour-circuit-wrapper',
          title: 'Managing components',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p>
                Notice that you can right click anywhere on the canvas
                to access some handy commands, like duplicate, undo
                &amp; redo and component configuration editing.
              </p>
              <img
                src={contextMenu}
                alt="Context menu example video"
                style={{
                  ...imageStyle,
                  width: 268,
                  height: 132,
                }}
              />
            </div>
          ),
          spotlightPadding: 30,
        },
        {
          target: '[data-linkid="clock-out-link"]',
          title: 'Wiring components',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p>
                To wire components together, you can drag a
                component&apos;s port onto another port.
              </p>
              <img
                src={wire}
                alt="Wiring components example video"
                style={{
                  ...imageStyle,
                  width: 268,
                  height: 178,
                }}
              />
              <p>
                <strong>Oh! Important note:</strong> you can select a
                wire by clicking it, and delete it using the Delete
                key.
              </p>
            </div>
          ),
          placement: 'top',
          spotlightPadding: 45,
        },
        {
          target: '[data-linkid="not-in-link"]',
          title: 'Wiring components',
          content: (
            <span
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <p>
                You can also drag a new wire from an existing wire.
              </p>
              <img
                src={bifurcation}
                alt="Bifurcating wires example video"
                style={{
                  ...imageStyle,
                  width: 268,
                  height: 160,
                }}
              />
              <p>
                <strong>Another important note:</strong> you can leave
                the wire with a loose end and connect it afterwards.
              </p>
            </span>
          ),
          placement: 'top',
          spotlightPadding: 45,
        },
        {
          target: '#simulation-control-buttons',
          title: 'Simulation control',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p>
                After wiring it all together, you just need to run the
                simulation to test your ideas!
              </p>
              <img
                src={simulation}
                alt="Simulation execution example video"
                style={{
                  ...imageStyle,
                  width: 254,
                  height: 194,
                }}
              />
              <p>Useful shortcuts:</p>
              <ul style={{ margin: 0 }}>
                <li>
                  <strong>Play/pause:</strong>
                  <Key size={24}>SPACE</Key>
                </li>
                <li>
                  <strong>Stop:</strong>
                  <Key size={24}>CTRL</Key>
                  <Key size={24}>SPACE</Key>
                </li>
              </ul>
            </div>
          ),
          placement: 'top',
        },
        {
          target: '#help-button',
          title: 'Still need help?',
          content: (
            <span>
              <p>
                In case you need any assistance in the future, come
                back to this help button. Here you&apos;ll find:
              </p>
              <ol style={{ lineHeight: '200%' }}>
                <li>All keyboard shortcuts</li>
                <li>More about the project</li>
                <li>
                  And this tour, if you feel like doing it another
                  time
                </li>
              </ol>
            </span>
          ),
        },
        {
          target: '#save-load-buttons',
          title: 'By the way...',
          content: (
            <span>
              <p>
                After you&apos;ve done your amazing circuit,
                don&apos;t forget that you can save it and reload it
                later!
              </p>
              <p>Useful shortcuts:</p>
              <ul style={{ margin: 0 }}>
                <li>
                  <strong>Save:</strong>
                  <Key size={24}>CTRL</Key>
                  <Key size={24}>S</Key>
                </li>
                <li>
                  <strong>Load:</strong>
                  <Key size={24}>CTRL</Key>
                  <Key size={24}>L</Key>
                </li>
              </ul>
            </span>
          ),
        },
        {
          target: 'body',
          title: "And that's all folks!",
          content: (
            <div>
              <p>
                If you want to know more about the project,{' '}
                <a
                  href="https://github.com/renato-bohler/logossim"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  check us out on GitHub!
                </a>
              </p>
              <GitHubButton
                type="stargazers"
                namespace="renato-bohler"
                repo="logossim"
              />
              <p>
                <strong>You can help us</strong> make logossim better!
                If you know a little bit of web development, you can
                quite easily develop new components to the
                application.
              </p>
            </div>
          ),
          placement: 'center',
          showProgress: false,
          showSkipButton: false,
          disableOverlayClose: false,
        },
      ],
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.recenterTourCircuit);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.recenterTourCircuit);
  }

  recenterTourCircuit = () => {
    const { currentStep } = this.state;
    const { run } = this.props;

    if (!run) return;
    if (currentStep < 3) return;

    const { recenterCircuit } = this.props;
    recenterCircuit();
  };

  callback = ({ type, action, index }) => {
    const { setTourRunning, loadCircuit, clearCircuit } = this.props;

    // Next step
    if (type === EVENTS.STEP_AFTER) {
      if (index === 2 && action === ACTIONS.NEXT) loadCircuit();
      if (index === 3 && action === ACTIONS.PREV) clearCircuit();

      this.setState({
        currentStep: index + (action === ACTIONS.NEXT ? 1 : -1),
      });
    }

    // Dismiss (skipping, closing or ending tour)
    if (type === EVENTS.TOUR_END || action === ACTIONS.CLOSE) {
      clearCircuit();
      localStorage.setItem('tour-done', true);
      setTourRunning(false);
      this.setState({ currentStep: 0 });
    }
  };

  render() {
    const { steps, currentStep } = this.state;
    const { run } = this.props;

    return (
      <>
        <Joyride
          run={run}
          steps={steps}
          stepIndex={currentStep}
          continuous
          scrollToFirstStep
          showProgress
          showSkipButton
          disableOverlayClose
          styles={{
            tooltip: {
              borderRadius: 10,
            },
            tooltipContent: {
              fontSize: 14,
              textAlign: 'left',
            },
            buttonBack: {
              color: 'black',
              fontSize: 12,
            },
            buttonNext: {
              background: '#6441a5',
              fontSize: 12,
              borderRadius: 5,
            },
            buttonSkip: {
              color: '#6441a5',
              fontSize: 12,
              border: '1px solid #6441a5',
              borderRadius: 5,
            },
          }}
          locale={{
            back: 'Back',
            close: 'Close',
            last: 'Got it!',
            next: 'Next',
            open: 'Open',
            skip: 'Skip',
          }}
          beaconComponent={Beacon}
          callback={this.callback}
        />
        <div
          style={{
            display: run ? 'block' : 'none',
            position: 'absolute',
            width: window.innerWidth * 0.75,
            height: window.innerHeight * 0.5,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          id="tour-circuit-area-wrapper"
        />
        <div
          style={{
            display: run ? 'block' : 'none',
            position: 'absolute',
            width: DIMENSIONS.width,
            height: DIMENSIONS.height,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          id="tour-circuit-wrapper"
        />
      </>
    );
  }
}
