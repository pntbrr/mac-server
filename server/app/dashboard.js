import blessed from 'neo-blessed'
import state from './state'
import { watch } from '../lib/reactive'
import chalk from 'chalk'

let dashboard
export default function createDashboard(stepsManager) {
    const screen = blessed.screen({
        smartCSR: true
    })
    screen.title = 'PontBarre Dashboard'

    screen.key(['q', 'C-c'], function (ch, key) {
        return process.exit(0);
    });

    screen.key(['n', 'space', 'right'], () => {
        stepsManager.nextStep()
    })
    screen.key(['p', 'backspace', 'left'], () => {
        stepsManager.prevStep()
    })
    screen.key(['t'], () => {
        state.press.isMoving.value = !state.press.isMoving.value
    })
    screen.key(['up'], () => {
        state.alcohol.gaugeVal.value += 0.1
    })
    screen.key(['down'], () => {
        state.alcohol.gaugeVal.value -= 0.1
    })
    screen.key(['r'], () => {
        stepsManager.goTo("start")
    })

    const logBox = blessed.box({
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50%',
        content: '',
        tags: true,
        scrollable: true,
        alwaysScroll: true,
        autoScroll: true,
        mouse: true,
        scrollbar: {
            bg: 'white'
        },
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            bg: '#051525',
            border: {
                fg: '#f0f0f0'
            },
        }
    })
    screen.append(logBox)

    const stepsBox = blessed.box({
        top: 0,
        left: '50%',
        width: '50%',
        height: '25%',
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            border: {
                fg: '#f0f0f0'
            },
        }
    })
    const stepsTitle = blessed.text({
        top: 0,
        left: 'center',
        height: 3,
        content: 'Current Step',
        style: {
            fg: 'white',
            bold: true,
        }
    })
    const stepsText = blessed.text({
        top: 'center',
        left: 'center',
        height: 2,
        content: stepsManager.currentStep,
        style: {
            fg: 'cyan',
            align: 'center,'
        }
    })
    const stepsProgress = blessed.progressbar({
        border: 'line',
        style: {
            fg: 'cyan',
            bg: 'default',
            bar: {
                bg: 'cyan',
                fg: 'default'
            },
            border: {
                fg: 'default',
                bg: 'default'
            }
        },
        width: '100%-2',
        height: 3,
        bottom: 0,
        left: 0,
        filled: 0
    });
    stepsBox.append(stepsTitle)
    stepsBox.append(stepsText)
    stepsBox.append(stepsProgress)
    screen.append(stepsBox)
    stepsManager.on('step', step => {
        stepsText.setContent(step)
        const progress = (stepsManager.currentStepIndex / (stepsManager.steps.length - 1)) * 100
        stepsProgress.setProgress(progress)
        screen.render()
    })

    const pourBox = blessed.box({
        top: '25%',
        left: '50%',
        width: '25%',
        height: '25%',
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            border: {
                fg: '#f0f0f0'
            },
        }
    })
    const pourTex = blessed.text({
        top: 'center',
        left: 'center',
        height: 2,
        content: 'Not pouring',
        style: {
            fg: 'green',
            align: 'center,'
        }
    })
    pourBox.append(pourTex)
    screen.append(pourBox)
    watch(state.press.isMoving, (moving) => {
        pourTex.setContent(moving
            ? 'Pouring'
            : 'Not pouring'
        )
        pourTex.style.fg = moving ? 'red' : 'green'
        screen.render()
    })

    const gaugeBox = blessed.box({
        top: '25%',
        left: '75%',
        width: '25%',
        height: '25%',
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            border: {
                fg: '#f0f0f0'
            },
        }
    })

    const gaugeProgress = blessed.progressbar({
        border: 'line',
        style: {
            fg: 'white',
            bg: 'default',
            bar: {
                bg: 'red',
                fg: 'red'
            },
            border: {
                fg: 'default',
                bg: 'default'
            }
        },
        ch: ':',
        width: 4,
        height: '100%-2',
        top: 0,
        right: 2,
        filled: 10,
        orientation: 'vertical'
    });
    const gaugeText = blessed.text({
        top: 'center',
        left: 2,
        height: 2,
        content: 'Gauge: 0%',
        style: {
            fg: 'white',
            align: 'center,'
        }
    })
    gaugeBox.append(gaugeProgress)
    gaugeBox.append(gaugeText)
    screen.append(gaugeBox)
    watch(state.alcohol.gaugeVal, val => {
        val = Math.round(val * 100) / 10
        gaugeProgress.setProgress(val)
        gaugeText.setContent(`Gauge: ${val}%`)
        screen.render()
    })

    const devicesBox = blessed.box({
        top: 0,
        left: 0,
        width: '50%',
        height: '50%',
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            border: {
                fg: '#f0f0f0'
            },
        }
    })
    screen.append(devicesBox)
    const updateDevices = () => {
        let devicesText = '    Spheros: ' + (state.connectedDevices.spherosb.v
            ? chalk.black.bgBlue(' Connected ')
            : chalk.black.bgRed(' Not Connected '))

        devicesText += '\n   BlueTile: ' + (state.connectedDevices.blueTile.v
            ? chalk.black.bgBlue(' Connected ')
            : chalk.black.bgRed(' Not Connected '))

        let animationColor = 'bgRed'
        if (state.connectedDevices.animations.v === 1) {
            animationColor = 'bgYellow'
        }
        if (state.connectedDevices.animations.v === 2) {
            animationColor = 'bgGreen'
        }
        devicesText += '\n Animations: ' + chalk[animationColor].black(` ${state.connectedDevices.animations.v} connected `)

        devicesText += '\n      Gauge: ' + (state.connectedDevices.gauge.v
            ? chalk.black.bgGreen(' Connected ')
            : chalk.black.bgRed(' Not Connected '))
        devicesText += '\n      Valve: ' + (state.connectedDevices.valve.v
            ? chalk.black.bgGreen(' Connected ')
            : chalk.black.bgRed(' Not Connected '))
        devicesText += '\n      Drone: ' + (state.connectedDevices.drone.v
            ? chalk.black.bgGreen(' Connected ')
            : chalk.black.bgRed(' Not Connected '))

        devicesBox.setContent(devicesText)
        screen.render()
    }
    updateDevices()
    watch(state.connectedDevices.valve, updateDevices)
    watch(state.connectedDevices.spherosb, updateDevices)
    watch(state.connectedDevices.drone, updateDevices)
    watch(state.connectedDevices.blueTile, updateDevices)
    watch(state.connectedDevices.gauge, updateDevices)
    watch(state.connectedDevices.animations, updateDevices)


    const responsive = () => {
        if (screen.width < screen.height * 2) {
            logBox.bottom = 0
            logBox.left = 0
            logBox.width = '100%'
            logBox.height = '50%'

            stepsBox.top = 0
            stepsBox.left = '50%'

            pourBox.top = '25%'
            pourBox.left = '50%'

            gaugeBox.top = '25%'
            gaugeBox.left = '75%'
        } else {
            logBox.bottom = 0
            logBox.left = '50%'
            logBox.width = '50%'
            logBox.height = '100%'

            stepsBox.top = '50%'
            stepsBox.left = 0

            pourBox.top = '75%'
            pourBox.left = 0

            gaugeBox.top = '75%'
            gaugeBox.left = '25%'
        }
        screen.render();
    }
    responsive()
    screen.on('resize', responsive)

    dashboard = {
        screen,
        logBox
    }
}

export function log(...data) {
    if (dashboard) {
        const {screen, logBox} = dashboard
        logBox.pushLine(data[0].toString())
        logBox.setScrollPerc(100)
        screen.render()
    } else {
        console.log(...data)
    }
}
