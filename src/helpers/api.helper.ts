import { MethodTypes, MobileEventStatuses } from 'common/enums';
import Axios from 'axios';

const updateMobileEventStatus = async (
  eventId: string,
  mobileStatus: MobileEventStatuses,
  isDraft: boolean
) => {
  const method = isDraft ? MethodTypes.PUT : MethodTypes.POST;

  await Axios[method](
    `https://api.tourneymaster.org/v2/pub_to_csports?event_id=${eventId}&level=${mobileStatus}`
  );
};

export { updateMobileEventStatus };
