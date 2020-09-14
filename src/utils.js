import styles from './styles'

export default {
    getLineColorStyle(category) {
        if (typeof category !== 'string') return;
        switch (category.toUpperCase()) {
            case 'LARANJA':
                return styles.orange;
            case 'AMARELA':
                return styles.yellow;
            case 'VERDE':
                return styles.green;
            case 'VERMELHA':
                return styles.red;
            case 'AZUL':
                return styles.blue;
            case 'PRATA':
                return styles.gray;
            case 'BRANCA':
                return styles.white;
        }
    }
}