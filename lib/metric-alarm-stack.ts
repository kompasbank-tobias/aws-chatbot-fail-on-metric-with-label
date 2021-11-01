import { Alarm, Color, Metric, Statistic } from "@aws-cdk/aws-cloudwatch";
import * as cdk from "@aws-cdk/core";
import { Duration } from "@aws-cdk/core";

export class MetricAlarmStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const validMetric = new Metric({
      namespace: "SomeNS",
      metricName: "ValidMetric",
    });
    new Alarm(this, "ValidAlarm", {
      evaluationPeriods: 1,
      metric: validMetric,
      threshold: 1,
    });

    const invalidMetric = new Metric({
      namespace: "SomeOtherNS",
      metricName: "InvalidMetric",
      label: "Some label used on a graph", // This will make chatbot fail
      color: Color.RED,
    });

    // Here we will usually add the metric to a graph in a dashboard, (hence the label definition)

    new Alarm(this, "InvalidAlarm", {
      evaluationPeriods: 1,
      metric: invalidMetric,
      threshold: 1,
    });
  }
}
