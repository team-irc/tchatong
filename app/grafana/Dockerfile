FROM grafana/grafana

COPY ./grafana.ini /etc/grafana
COPY ./srcs/datasource.yaml /etc/grafana/provisioning/datasources
COPY ./srcs/dashboard.yaml /etc/grafana/provisioning/dashboards
COPY ./srcs/* /usr/share/grafana/conf/provisioning/dashboards/
