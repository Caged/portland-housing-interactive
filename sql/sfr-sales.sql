-- Single Family Residential Sales >= 1990
--
COPY (
  SELECT
    extract(year from sale_date_latest) as year,
    round(sale_price_latest_adjusted::numeric) as spl_adjusted,
    round(sale_price_previous_adjusted::numeric) spp_adjusted,
    round(price_difference::numeric) as price_diff,
    round(price_difference_adjusted::numeric) as price_diff_adjusted,
    round(percent_increase) as percent_increase,
    round(percent_increase_adjusted) as percent_increase_adjusted,
    days_between_sales
     FROM taxlot_price_history
     WHERE land_use = 'SFR'
         AND sale_date_latest >= '1990-01-01'
         AND days_between_sales > 0 and days_between_sales <= 365
) TO STDOUT WITH csv header
