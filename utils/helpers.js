export async function polyfillNumberformat(
    locale,
    shouldThrow,
  ) {
    const { shouldPolyfill } = await import(
      /* webpackMode: "lazy" */
      /* webpackPrefetch: true */
      '@formatjs/intl-numberformat/should-polyfill'
    );
  
    if (!shouldPolyfill()) {
      return;
    }
  
    await polyfillPluralrules(locale, false);
    // Load the polyfill 1st BEFORE loading data
    await import(
      /* webpackMode: "lazy" */
      /* webpackPrefetch: true */
      '@formatjs/intl-numberformat/polyfill'
    );
    try {
      await import(
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        `@formatjs/intl-numberformat/locale-data/en`
      );
    } catch (e) {
      if (shouldThrow) throw e;
      else
        await import(
          /* webpackMode: "lazy" */
          /* webpackPrefetch: true */
          '@formatjs/intl-numberformat/locale-data/en'
        );
    }
  }


export const formatAmount = (data) => {
    const options = typeof data.options !== 'object' ? {} : data.options;
    let value = '0.00'
    const type = data.type ? ` ${data.type}` : '';
    if (data.amount && data.currency) {
      value = `${data.amount}${type}`;
      const currency = data.currency?.toUpperCase();
      const numberFormatOptions = {
        minimumFractionDigits: 0,
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
        ...options,
      };
  
      if (!(Intl && Intl.NumberFormat)) {
        (async () => {
          await polyfillNumberformat('en', false);
  
          const amount = new Intl.NumberFormat(
            'en-NG',
            numberFormatOptions,
          ).format(data.amount);
  
          value = `${amount}${type}`;
        })();
      } else {
        const amount = new Intl.NumberFormat(
          'en-NG',
          numberFormatOptions,
        ).format(data.amount);
  
        value = `${amount}${type}`;
      }
    }
  
    return value;
  };

export const addToCart = (a)=>{
  console.log('addToCart',a)
}  

