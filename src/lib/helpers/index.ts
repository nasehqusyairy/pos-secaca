
// Helpers

// function to split string
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeWords(string: string) {
    if (string === null || string === undefined || string === '') {
        return '';
    }

    return string.split('_').map(capitalizeFirstLetter).join(' ');
}

export function removeNullOrUndefined(obj: any) {
    for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
    }
    return obj;
}

export function formatToIDR(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

export function formatDateToYYYYMMDD(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function formatDateToStringDate(date: Date, addHour = false) {
    if (addHour) {
        const formatter = new Intl.DateTimeFormat('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        return `${formatter.format(date).replace('.', ':')}`;
    }

    const formatter = new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    return formatter.format(date);
}
