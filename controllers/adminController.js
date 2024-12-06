import User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Get all users whose isVerified is false
export const getUnverifiedUsers = async (req, res) => {
    try {
        // Find users with isVerified set to false
        const users = await User.find({ isVerified: false });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



// Update the verification status of a user (verify, unverify, delete)
export const updateUserVerification = async (req, res) => {
    const { userId, action } = req.body; // action will be 'verify', 'unverify', or 'delete'
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (action === 'verify') {
            user.isVerified = true;
            await user.save();
            return res.status(200).json({ message: "User verified successfully", user });
        }

        if (action === 'unverify') {
            user.isVerified = false;
            await user.save();
            return res.status(200).json({ message: "User unverifiable successfully", user });
        }

        if (action === 'delete') {
            await User.deleteOne({ _id: userId }); // Use deleteOne instead of remove
            return res.status(200).json({ message: "User deleted successfully" });
        }

        if (action === 'makeAdmin') {
            user.role = 'admin'; // Set the user's role to 'admin'
            await user.save();
            return res.status(200).json({ message: "User role updated to admin successfully", user });
        }

        return res.status(400).json({ message: "Invalid action" });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}

