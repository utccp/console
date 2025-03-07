import * as React from 'react';
import { shallow } from 'enzyme';
import { ResourceOverviewDetails } from '@console/internal/components/overview/resource-overview-details';
import { LoadingBox } from '@console/internal/components/utils';
import { OverviewItem } from '@console/shared';
import TopologySideBarContent from '@console/topology/src/components/side-bar/TopologySideBarContent';
import { RevisionModel, EventingSubscriptionModel } from '../../../models';
import {
  revisionObj,
  EventSubscriptionObj,
} from '../../../topology/__tests__/topology-knative-test-data';
import { KnativeResourceOverviewPage } from '../KnativeResourceOverviewPage';

describe('KnativeResourceOverviewPage', () => {
  let item: OverviewItem;
  beforeEach(() => {
    item = {
      obj: revisionObj,
    };
  });

  it('should not render if kindsInFlight is true and knativeModels is empty', () => {
    const wrapper = shallow(<KnativeResourceOverviewPage item={item} kindsInFlight />);
    expect(wrapper.isEmptyRender()).toBe(true);
  });
  it('should render LoadingBox kindsInFlight is true and knativeModels is not empty', () => {
    const wrapper = shallow(
      <KnativeResourceOverviewPage item={item} knativeModels={[RevisionModel]} kindsInFlight />,
    );
    expect(wrapper.find(LoadingBox)).toHaveLength(1);
  });
  it('should render ResourceOverviewDetails kindsInFlight is false', () => {
    const wrapper = shallow(
      <KnativeResourceOverviewPage
        item={item}
        knativeModels={[RevisionModel]}
        kindsInFlight={false}
      />,
    );
    expect(wrapper.find(TopologySideBarContent)).toHaveLength(1);
  });
  it('should render ResourceOverviewDetails for subscription with proper action menu', () => {
    const itemData = { ...item, ...{ obj: EventSubscriptionObj } };
    const wrapper = shallow(
      <KnativeResourceOverviewPage
        item={itemData}
        knativeModels={[EventingSubscriptionModel]}
        kindsInFlight={false}
      />,
    );
    const resourceOverviewDetails = wrapper.find(ResourceOverviewDetails);
    expect(resourceOverviewDetails).toHaveLength(1);
    expect(resourceOverviewDetails.at(0).props().menuActions).toHaveLength(4);
    expect(resourceOverviewDetails.at(0).props().kindObj).toEqual(EventingSubscriptionModel);
  });
});
