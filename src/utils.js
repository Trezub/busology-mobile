import styles from './styles'

export default {
    getLineColorStyle(category) {
        switch (category) {
            case 'AL':
                return styles.orange;
            case 'TR':
            case 'CO':
                return styles.yellow;
            case 'IN':
                return styles.green;
            case 'EX':
                return styles.red;
            case 'LG':
                return styles.blue;
            case 'LD':
                return styles.gray;
            case 'CI':
                return styles.white;
        }
    }
}