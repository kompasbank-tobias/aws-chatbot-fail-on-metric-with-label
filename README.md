# AWS ChatBot fails to send message to Slack

If a label is defined on a Metric for which an alarm is created, the format of the output seems to be unsupported by ChatBot.

Example of definition of metrics + alarms:

```typescript
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
```

CloudFormation output:

```yaml
Resources:
  ValidAlarm22A073C4:
    Type: AWS::CloudWatch::Alarm
    Properties:
      ComparisonOperator: GreaterThanOrEqualToThreshold
      EvaluationPeriods: 1
      MetricName: ValidMetric
      Namespace: SomeNS
      Period: 300
      Statistic: Average
      Threshold: 1
    Metadata:
      aws:cdk:path: MetricAlarmStack/ValidAlarm/Resource
  InvalidAlarmB1C1746B:
    Type: AWS::CloudWatch::Alarm
    Properties:
      ComparisonOperator: GreaterThanOrEqualToThreshold
      EvaluationPeriods: 1
      Metrics:
        - Id: m1
          Label: Some label used on a graph
          MetricStat:
            Metric:
              MetricName: InvalidMetric
              Namespace: SomeOtherNS
            Period: 300
            Stat: Average
          ReturnData: true
      Threshold: 1
    Metadata:
      aws:cdk:path: MetricAlarmStack/InvalidAlarm/Resource
  CDKMetadata:
    Type: AWS::CDK::Metadata
    Properties:
      Analytics: v2:deflate64:H4sIAAAAAAAA/yXKPQ7CMAxA4bN0T12CGGAD9QblBJFjRPoTS7ZDhyh3R5TpveHz4M83OHX3sGuPcRkqshDUpwVc3MhZTQqaG195IuUiSM0dduUS92D4hvpYg2w/ckxrLnMkmHX4+Av4K/hu1pR6KdnSRjD9+wXwNpo3ewAAAA==
    Metadata:
      aws:cdk:path: MetricAlarmStack/CDKMetadata/Default
```

Result in Chatbot log:

```
Event received is not supported (see https://docs.aws.amazon.com/chatbot/latest/adminguide/related-services.html ): ...
...
...
```
