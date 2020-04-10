import React, { Component } from 'react';
import styles from './styles.module.scss';

class ResourceMatrix extends Component {
  render() {
    return (
      <section className={styles.container}>
        <div className={styles.leftColumn}></div>
        <div className={styles.rightColumn}></div>
      </section>
    );
  }
}

export default ResourceMatrix;
