import React from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBell,
  faEnvelope,
  faStickyNote,
  faCog,
  faCheckCircle,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.scss';
import Button from '../common/buttons/button';

class Dashboard extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.dashboard}>
          <div
            className={classnames(styles.paper, styles['main-menu'])}
            style={{ marginTop: '76px' }}
          >
            <Button
              label="Edit Dashboard Layout"
              variant="text"
              color="secondary"
            />
            <Button
              label="Create tournament"
              variant="contained"
              color="primary"
            />
          </div>
          <div className={styles['container']}>
            <div className={styles['menu']}>
              <div className={styles['item']}>
                <FontAwesomeIcon className={styles['icon']} icon={faUser} />
                <b>My Dashboard</b>
              </div>
              <div className={styles['item']}>
                <FontAwesomeIcon
                  className={styles['icon']}
                  icon={faStickyNote}
                />
                Library Manager
              </div>
              <div className={styles['item']}>
                <FontAwesomeIcon className={styles['icon']} icon={faEnvelope} />
                Messages
              </div>
              <div className={styles['item']}>
                <FontAwesomeIcon
                  className={styles['icon']}
                  icon={faStickyNote}
                />
                Notes
              </div>
              <div className={styles['item']}>
                <FontAwesomeIcon className={styles['icon']} icon={faCog} />
                Settings
              </div>
            </div>
            <div className={styles['main']}>
              <div className={styles['title']}>My Dashboard</div>
              <div className={styles['info-wrapper']}>
                <div className={classnames(styles['paper'], styles['alerts'])}>
                  <div className={styles['card-title']}>Alerts</div>
                  <div className={styles['alert']}>
                    <div className={styles['alert-logo']}>
                      <FontAwesomeIcon icon={faBell} />
                    </div>
                    <div className={styles['alert-message']}>
                      <div>1 Team has requested feedback</div>
                      <div className={styles['additionl-message']}>
                        01/14/20
                      </div>
                    </div>
                  </div>
                  <div className={styles['alert']}>
                    <div className={styles['alert-logo']}>
                      <FontAwesomeIcon icon={faBell} />
                    </div>
                    <div className={styles['alert-message']}>
                      <div>
                        1 Team has registered for{' '}
                        <span className={styles['link']}>Field Hockey I</span>
                      </div>
                      <div className={styles['additionl-message']}>
                        01/14/20
                      </div>
                    </div>
                  </div>
                  <div className={styles['alert']}>
                    <div className={styles['alert-logo']}>
                      <FontAwesomeIcon icon={faBell} />
                    </div>
                    <div className={styles['alert-message']}>
                      <div>5 Teams request feedback</div>
                      <div className={styles['additionl-message']}>
                        01/14/20
                      </div>
                    </div>
                  </div>
                  <div className={styles['alert']}>
                    <div className={styles['alert-logo']}>
                      <FontAwesomeIcon icon={faBell} />
                    </div>
                    <div className={styles['alert-message']}>
                      <div>
                        2 Teams have registered for{' '}
                        <span className={styles['link']}>Field Hockey I</span>
                      </div>
                      <div className={styles['additionl-message']}>
                        01/14/20
                      </div>
                    </div>
                  </div>
                  <div className={styles['expand']}>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </div>
                <div className={classnames(styles['paper'], styles['todos'])}>
                  <div className={styles['card-title']}>To Do</div>
                  <div className={styles['todo']}>
                    <div
                      className={styles['todo-logo']}
                      style={{ color: '#8B8B8C' }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div className={styles['todo-message']}>
                      <div>
                        Resolve TRUE Florida{' '}
                        <span className={styles['link']}>scheduling</span>{' '}
                        conflict
                      </div>
                      <div className={styles['additionl-message']}>
                        Due by 02/01/20
                      </div>
                    </div>
                  </div>
                  <div className={styles['todo']}>
                    <div
                      className={styles['todo-logo']}
                      style={{ color: '#8B8B8C' }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div className={styles['todo-message']}>
                      <div>
                        Finalize{' '}
                        <span className={styles['link']}>
                          Men's Spring Thaw
                        </span>{' '}
                        Registration
                      </div>
                      <div className={styles['additionl-message']}>
                        Due by 02/01/20
                      </div>
                    </div>
                  </div>
                  <div className={styles['todo']}>
                    <div className={styles['todo-logo']}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div className={styles['todo-message']}>
                      <div>
                        Resolve Trilogy{' '}
                        <span className={styles['link']}>scheduling</span>{' '}
                        conflict
                      </div>
                      <div className={styles['additionl-message']}>
                        Completed 01/02/20
                      </div>
                    </div>
                  </div>
                  <div className={styles['expand']}>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </div>
              </div>
              <div className={styles['buttons-group']}>
                <div className={styles['button']}>Live (1)</div>
                <div className={styles['button']}>Draft (1)</div>
                <div className={styles['button']}>Historical (0)</div>
              </div>
              <div className={styles['tournaments-wrapper']}>
                <div
                  className={classnames(styles['paper'], styles['tournament'])}
                >
                  <div className={styles['tournament-info']}>
                    <div className={styles['tournament-logo']}>
                      <img alt={'sport logo'} />
                    </div>
                    <div className={styles['tournament-title']}>
                      <div className={styles['card-title']}>Field Hockey I</div>
                      <div>01/01/2020 - 04/01/2020</div>
                    </div>
                  </div>
                  <div className={styles['stats']}>
                    <div className={styles['column']}>
                      <div className={styles['info']}>
                        <span className={styles['column-title']}>
                          Teams RSVP:
                        </span>
                        2/8
                      </div>
                      <div className={styles['info']}>
                        <span className={styles['column-title']}>
                          Locations:
                        </span>
                        1
                      </div>
                      <div className={styles['info']}>
                        <span className={styles['column-title']}>
                          Schedule:
                        </span>
                        <span className={styles['link']}>Available</span>
                      </div>
                    </div>
                    <div className={styles['column']}>
                      <div className={styles['info']}>
                        <span className={styles['column-title']}>Players:</span>
                        122
                      </div>
                      <div className={styles['info']}>
                        <span className={styles['column-title']}>Fields:</span>1
                      </div>
                      <div className={styles['info']}>
                        <span className={styles['column-title']}>Status:</span>
                        Live
                        <div className={styles['status-circle']}></div>
                      </div>
                    </div>
                  </div>
                  <div className={styles['tournament-buttons']}>
                    <div className={styles['button']}>Manage</div>
                    <div className={styles['link']}>Duplicate</div>
                  </div>
                </div>
                <div
                  className={classnames(styles['paper'], styles['tournament'])}
                >
                  <div className={styles['tournament-info']}>
                    <div className={styles['tournament-logo']}>
                      <img alt={'sport logo'} />
                    </div>
                    <div className={styles['tournament-title']}>
                      <div className={styles['card-title']}>Field Hockey I</div>
                      <div>01/01/2020 - 04/01/2020</div>
                    </div>
                  </div>
                  <div className={styles['stats']}>
                    <div className={styles['column']}>
                      <div className={styles['info']}>
                        <span className={styles['column-title']}>Teams:</span>
                        24
                      </div>
                      <div className={styles['info']}>
                        <span className={styles['column-title']}>
                          Locations:
                        </span>
                        1
                      </div>
                      <div className={styles['info']}>
                        <span className={styles['column-title']}>
                          Schedule:
                        </span>
                        Pending
                      </div>
                    </div>
                    <div className={styles['column']}>
                      <div className={styles['info']}>
                        <span className={styles['column-title']}>Players:</span>
                        304
                      </div>
                      <div className={styles['info']}>
                        <span className={styles['column-title']}>Fields:</span>6
                      </div>
                      <div className={styles['info']}>
                        <span className={styles['column-title']}>Status:</span>
                        Draft
                        <div
                          className={styles['status-circle']}
                          style={{ backgroundColor: '#FFCB00' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className={styles['tournament-buttons']}>
                    <div className={styles['button']}>Manage</div>
                    <div className={styles['link']}>Duplicate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
