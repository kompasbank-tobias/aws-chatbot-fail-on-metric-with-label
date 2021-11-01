import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as MetricAlarm from '../lib/metric-alarm-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new MetricAlarm.MetricAlarmStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
