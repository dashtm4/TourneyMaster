import React from 'react';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import SectionDropdown from '../common/section-dropdown';
import styles from './styles.module.scss';

const LibraryManaget = () => (
  <section>
    <p className={styles.btnWrapper}>
      <Button
        label="Link Data"
        variant="contained"
        color="primary"
        type="string"
      />
    </p>
    <div className={styles.headingWrapper}>
      <HeadingLevelTwo>Registration</HeadingLevelTwo>
    </div>
    <ul className={styles.libraryList}>
      <li>
        <SectionDropdown>
          <span>Primary Information</span>
          <div className={styles['tournament-content']}>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Division:
              </span>
              <p>2020, 2012</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Open Date:
              </span>
              <p>01/01/20</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Close Date:
              </span>
              <p>01/31/20</p>
              <span className={styles['tournament-status']} />
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Entry Fee:
              </span>
              <p>$100.00</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Deposit Fee:
              </span>
              <p>$25.00</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Early Bird Discount:
              </span>
              <p>None</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Discount End Date:
              </span>
              <p>—</p>
            </div>
          </div>
        </SectionDropdown>
      </li>
      <li>
        <SectionDropdown>
          <span>Teams & Athletes</span>
          <div className={styles['tournament-content']}>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Max Teams Per Division:
              </span>
              <p>—</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Min Athletes on Roster:
              </span>
              <p>—</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Max Athletes on Roster:
              </span>
              <p>—</p>

              <span className={styles['tournament-status']} />
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Athlete Birth Date:
              </span>
              <p>Require</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Athlete Jersey Number:
              </span>
              <p>Require</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Athlete Email:
              </span>
              <p>Require</p>
            </div>
          </div>
        </SectionDropdown>
      </li>
      <li>
        <SectionDropdown>
          <span>Main Contact</span>
          <div className={styles['tournament-content']}>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>First:</span>
              <p>John</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>Last:</span>
              <p>Anderson</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>Role:</span>
              <p>None</p>

              <span className={styles['tournament-status']} />
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>Email:</span>
              <p>janderson@gmail.com</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Mobile Number:
              </span>
              <p>612-456-8203</p>
            </div>
            <div className={styles['tournament-content-item']}>
              <span className={styles['tournament-content-title']}>
                Permission to Text:
              </span>
              <p>No</p>
            </div>
          </div>
        </SectionDropdown>
      </li>
    </ul>
  </section>
);

export default LibraryManaget;
