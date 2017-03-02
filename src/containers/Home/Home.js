import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import ReactTooltip from 'react-tooltip'
import * as authActions from 'redux/actions/auth'

import Alert from 'react-bootstrap/lib/Alert'

import Amount from 'components/Amount/Amount'

import Onboarding from 'containers/Onboarding/Onboarding'
import SendForm from 'containers/SendForm/SendForm'
import History from 'containers/History/History'
import Stats from 'containers/Stats/Stats'

import classNames from 'classnames/bind'
import styles from './Home.scss'
const cx = classNames.bind(styles)

@connect(
  state => ({
    user: state.auth.user,
    activeTab: state.auth.activeTab,
    verified: state.auth.verified,
    config: state.auth.config
  }),
  authActions)
export default class Home extends Component {
  static propTypes = {
    user: PropTypes.object,
    reload: PropTypes.func,
    config: PropTypes.object,
  }

  state = {}

  reload = () => {
    this.setState({
      ...this.state,
      reloading: true
    })

    this.props.reload({ username: this.props.user.username })
      .then(() => {
        this.setState({
          ...this.state,
          reloading: false
        })
      })
      .catch(() => {
        this.setState({
          ...this.state,
          reloading: false
        })
      })
  }

  handleDefaultPayment = () => {
    navigator.registerPaymentHandler('interledger', location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/widget')
  }

  toggleStats = (event) => {
    this.setState({
      ...this.state,
      showStats: !this.state.showStats
    })

    event.preventDefault()

    tracker.track('Toggle Stats')
  }

  render() {
    const { user, config } = this.props
    const { showStats, reloading } = this.state

    // For some reason dynamic routers have problems with that state
    if (!user) return null
    return (
      <div className="row">
        <div className={cx('col-sm-8', 'historyBox')}>
          {/* Onboarding */}
          <Onboarding />

          {/* History */}
          {/* <div>
            {showStats &&
            <a href="" onClick={this.toggleStats}>Payment History</a>}
            {!showStats &&
            <span>Payment History</span>}
          </div>
          <div className="pull-right">
            {showStats &&
            <span>Stats</span>}
            {!showStats &&
            <a href="" onClick={this.toggleStats}>Stats</a>}
          </div> */}

          <div className={cx('header')}>
            <h3>Payment history</h3>
          </div>

          {!showStats && <History />}
          {showStats && <Stats />}
        </div>
        <div className="col-sm-4">
          {/*
           <div className="panel panel-default">
           <div className="panel-heading">
           <div className="panel-title">Use ILP kit as your default payment provider</div>
           </div>
           <div className="panel-body">
           <button className="btn btn-complete btn-block" onClick={this.handleDefaultPayment}>Set as default</button>
           </div>
           </div>
           */}

          {/* Balance */}
          <div className={cx('balanceContainer')}>
            <h4 className={cx('balanceDescription')}>Your Balance</h4>
            <div className={cx('balance')}>
              <Amount amount={user.balance} currencySymbol={config.currencySymbol} />
              {config.reload && <span className={cx('but')}>*</span>}
            </div>
            {config.reload &&
            <div>
              <a className="btn btn-success btn-lg"
                 onClick={!user.isAdmin && this.reload} disabled={user.isAdmin}
                 data-tip={user.isAdmin && "You have enough, you're the admin"}>
                {!reloading && 'Get More'}
                {reloading && 'Getting...'}
              </a>
              <div className={cx('balanceFake')}>* Don't get too excited, this is fake money</div>
            </div>}
          </div>

          {/* Send Form */}
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="panel-title">Send Money</div>
            </div>
            <div className="panel-body">
              <SendForm />
            </div>
          </div>
        </div>

        <ReactTooltip />
      </div>
    )

  }
}
