import Profile from '../models/profileModel.js';
import User from '../models/userModel.js';

export const createProfile = async (req, res, next) => {
  const owner = req.user._id;
  console.log(owner);
  const { firstName, middleName, lastName, location } = req.body;
  try {
    const user = await User.findById(owner);
    const newProfile = new Profile({
      owner,
      firstName,
      middleName,
      lastName,
      location
    });
    await newProfile.save();
    user.profile = newProfile;
    await user.save();
    return res.status(200).json({ msg: 'profile created successfully' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
export const getAllPrfoile = async (req, res, next) => {
  try {
    const profiles = await Profile.find();
    return res.status(200).json(profiles);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getUserProfile = async (req, res, next) => {
  const { profileId } = req.params;
  try {
    const profile = await Profile.findById(profileId);
    if (profile) {
      return res.status(200).json(profile);
    } else {
      return res.status(400).json({ msg: 'profile not found' });
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
export const updateUserProfile = async (req, res, next) => {
  const { profileId } = req.params;
  try {
    const profile = await Profile.findByIdAndUpdate(profileId);
    if (profile) {
      return res.status(200).json(profile);
    } else {
      return res.status(400).json({ msg: 'profile not found' });
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
export const getUserFollowers = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.profileId);
    console.log(profile.followers);
    if (profile) {
      const followers = profile.followers;
      return res.status(200).json(followers);
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const addfollower = async (req, res, next) => {
  const { userId } = req.user._id;
  try {
    const profile = await Profile.findById(req.params.profileId);
    if (profile) {
      const profileIndex = profile.followers.findIndex(
        (p) => JSON.stringify(p.userId) === JSON.stringify(userId)
      );
      if (person.followers[profileIndex].userId === userId) {
        profile.followers = profile.followers.filter(
          (p) => JSON.stringify(p.userId) === JSON.stringify(userId)
        );
        await profile.save();
      } else {
        profile.followers.push(userId);
        await profile.save();
        return res.status(400).json({ msg: 'please login' });
      }
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
